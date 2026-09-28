import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from groq import Groq

from hindsight_memory import recall_similar_cases


class ResolveResponse(dict):
    """
    Structured response containing the AI recommendation along with the
    underlying recalled Hindsight memories.
    """
    def __init__(
        self,
        customer_issue: str,
        recalled_memories: List[Dict[str, Any]],
        recommendation: str,
    ):
        super().__init__(
            customer_issue=customer_issue,
            recalled_memories_count=len(recalled_memories),
            recalled_memories=recalled_memories,
            recommendation=recommendation,
        )
        self.customer_issue = customer_issue
        self.recalled_memories = recalled_memories
        self.recalled_memories_count = len(recalled_memories)
        self.recommendation = recommendation

    def __str__(self) -> str:
        return self.recommendation


SYSTEM_PROMPT = """You are ResolveIQ, an intelligent customer-support resolution agent.
Your goal is to provide experience-informed support recommendations based on historical support cases retrieved from Hindsight memory.

Rules you MUST strictly adhere to:
1. Grounding in Real Experience:
   - Use ONLY the provided Hindsight memories as historical support experience.
   - Do NOT invent or hallucinate past cases, tickets, or resolution attempts.
   - If the recalled memories are not sufficiently relevant to the current issue, explicitly state that no sufficiently relevant prior experience was found.
2. Evidence of Success:
   - Do NOT claim an action was successful unless the recalled memory explicitly provides evidence or verification of success.
3. Structure your response with the following distinct sections:
   - Understanding of the Issue: Clear summary of the reported problem.
   - Relevant Previous Experience: Summary of relevant historical cases, actions taken, and verified outcomes from memory.
   - Recommended Action: Specific, actionable troubleshooting or remediation steps.
   - Why the Action is Recommended: Technical reasoning linking the symptoms to the solution and previous empirical success.
   - Confidence & Limitations: An assessment of how confident the recommendation is, along with any limitations or edge cases.
   - Verification Note: A clear statement that this recommendation is synthesized from previous support experiences and should be tested/verified before applying in production.
"""


def _format_memories_for_prompt(memories: List[Dict[str, Any]]) -> str:
    """Formats recalled Hindsight memories into a clear text block for the LLM."""
    if not memories:
        return "No previous support experiences found in memory."

    formatted = []
    for idx, mem in enumerate(memories, start=1):
        mem_type = mem.get("type", "general")
        context = mem.get("context", "")
        text = mem.get("text", "").strip()

        header = f"--- Previous Experience #{idx} (Type: {mem_type}"
        if context:
            header += f", Context: {context}"
        header += ") ---"

        formatted.append(f"{header}\n{text}")

    return "\n\n".join(formatted)


def resolve_customer_issue(
    customer_issue: str,
    bank_id: Optional[str] = None,
    model: Optional[str] = None,
    language: str = "English",
) -> ResolveResponse:
    """
    Analyzes a customer issue by recalling relevant historical support experiences
    from Hindsight Cloud, then prompting the Groq LLM for an experience-informed
    resolution recommendation.

    Args:
        customer_issue: The issue description reported by the customer.
        bank_id: Optional Hindsight memory bank ID (defaults to resolveiq-support).
        model: Optional Groq model identifier (defaults to openai/gpt-oss-120b).
        language: Language for the generated recommendation.

    Returns:
        ResolveResponse containing the recommendation, recalled memories count,
        and raw recalled memories list.
    """
    load_dotenv()

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key or groq_api_key == "your_groq_api_key_here":
        raise ValueError(
            "Missing or placeholder GROQ_API_KEY. "
            "Please configure your Groq API key in backend/.env"
        )

    selected_model = model or os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # Step 1: Recall relevant previous support experiences from Hindsight
    recalled_memories = recall_similar_cases(query=customer_issue, bank_id=bank_id)

    # Step 2: Format recalled memories as context for the prompt
    context_text = _format_memories_for_prompt(recalled_memories)

    user_prompt = f"""Current Customer Issue:
{customer_issue.strip()}

Historical Support Memories from Hindsight:
{context_text}

Please provide an experience-informed support recommendation according to the required sections.
Write the complete recommendation in {language}."""

    # Step 3: Call Groq LLM
    client = Groq(api_key=groq_api_key)
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        model=selected_model,
        temperature=0.2,
    )

    recommendation = chat_completion.choices[0].message.content or ""

    return ResolveResponse(
        customer_issue=customer_issue,
        recalled_memories=recalled_memories,
        recommendation=recommendation,
    )
