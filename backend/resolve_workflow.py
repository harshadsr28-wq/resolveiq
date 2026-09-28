from typing import Any, Dict, List, Optional
from hindsight_memory import retain_case_outcome
from resolve_agent import resolve_customer_issue, ResolveResponse


def handle_customer_issue(
    customer_issue: str,
    bank_id: Optional[str] = None,
    model: Optional[str] = None,
    language: str = "English",
) -> Dict[str, Any]:
    """
    Handles an incoming customer support issue:
    1. Recalls relevant historical support experiences from Hindsight Cloud.
    2. Passes the recalled context to the Groq LLM reasoning agent.
    3. Returns a structured dictionary with customer_issue, recalled_memories,
       and the AI recommendation.

    Args:
        customer_issue: The issue description reported by the customer.
        bank_id: Optional Hindsight bank ID (defaults to resolveiq-support).
        model: Optional Groq model ID (defaults to openai/gpt-oss-120b).

    Returns:
        Dict containing customer_issue, recalled_memories, recalled_memories_count,
        and recommendation.
    """
    response: ResolveResponse = resolve_customer_issue(
        customer_issue=customer_issue,
        bank_id=bank_id,
        model=model,
        language=language,
    )

    return {
        "customer_issue": response.customer_issue,
        "recalled_memories": response.recalled_memories,
        "recalled_memories_count": response.recalled_memories_count,
        "recommendation": response.recommendation,
    }


def record_case_outcome(
    customer_issue: str,
    action_taken: str,
    outcome: str,
    verification_result: str,
    bank_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Records the actual resolution outcome of a customer support case into Hindsight Cloud,
    closing the learning loop so future similar queries benefit from this experience.

    Args:
        customer_issue: The customer issue that was resolved.
        action_taken: The remediation or troubleshooting steps taken.
        outcome: The resolution outcome (e.g. 'Resolved', 'Mitigated').
        verification_result: Empirical verification or metrics proving the outcome.
        bank_id: Optional Hindsight bank ID (defaults to resolveiq-support).

    Returns:
        Dict containing success status, bank_id, operation details, and confirmation message.
    """
    retain_result = retain_case_outcome(
        customer_issue=customer_issue,
        action_taken=action_taken,
        outcome=outcome,
        result=verification_result,
        bank_id=bank_id,
    )

    return {
        "success": retain_result.get("success", False),
        "bank_id": retain_result.get("bank_id"),
        "items_count": retain_result.get("items_count"),
        "operation_id": retain_result.get("operation_id"),
        "retained_content": retain_result.get("retained_content"),
        "message": "ResolveIQ learned from this outcome and stored the experience in Hindsight.",
    }
