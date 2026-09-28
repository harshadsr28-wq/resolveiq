import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from hindsight_client import Hindsight


def recall_similar_cases(query: str, bank_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Recalls relevant past support cases and memories from Hindsight Cloud for a given query.

    Args:
        query: The customer support problem statement or inquiry to search against.
        bank_id: Optional memory bank ID. Defaults to the HINDSIGHT_BANK_ID environment
                 variable or 'resolveiq-support'.

    Returns:
        A list of dictionaries representing matching memories, containing memory id,
        type, content text, scores, context, and metadata when available.
    """
    load_dotenv()

    api_key = os.getenv("HINDSIGHT_API_KEY")
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    target_bank = bank_id or os.getenv("HINDSIGHT_BANK_ID", "resolveiq-support")

    if not api_key:
        raise ValueError(
            "Missing HINDSIGHT_API_KEY environment variable. "
            "Please configure your key in backend/.env"
        )

    with Hindsight(base_url=base_url, api_key=api_key) as client:
        response = client.recall(bank_id=target_bank, query=query)

    clean_results: List[Dict[str, Any]] = []

    for item in response.results:
        scores: Dict[str, Any] = {}
        if item.scores:
            if hasattr(item.scores, "to_dict"):
                scores = item.scores.to_dict()
            elif isinstance(item.scores, dict):
                scores = item.scores

        clean_results.append({
            "id": item.id,
            "type": item.type,
            "text": item.text,
            "scores": scores,
            "context": item.context,
            "tags": item.tags,
            "document_id": item.document_id,
        })

    return clean_results


def retain_case_outcome(
    customer_issue: str,
    action_taken: str,
    outcome: str,
    result: str,
    bank_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Retains a customer support resolution experience into Hindsight Cloud for future learning and recall.

    Args:
        customer_issue: Description of the customer issue encountered.
        action_taken: Remediation or troubleshooting steps executed.
        outcome: Resolution status (e.g. 'Resolved', 'Workaround Applied', 'Escalated').
        result: Observed outcome or verification metrics.
        bank_id: Optional memory bank ID. Defaults to HINDSIGHT_BANK_ID or 'resolveiq-support'.

    Returns:
        A dictionary with operation details (success, bank_id, items_count, operation_id, retained_content).
    """
    load_dotenv()

    api_key = os.getenv("HINDSIGHT_API_KEY")
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    target_bank = bank_id or os.getenv("HINDSIGHT_BANK_ID", "resolveiq-support")

    if not api_key:
        raise ValueError(
            "Missing HINDSIGHT_API_KEY environment variable. "
            "Please configure your key in backend/.env"
        )

    # Format the experience naturally so Hindsight extracts high-quality semantic facts
    memory_content = (
        f"Customer Support Case Experience:\n"
        f"Customer Issue: {customer_issue.strip()}\n"
        f"Action Taken: {action_taken.strip()}\n"
        f"Outcome: {outcome.strip()}\n"
        f"Verification Result: {result.strip()}"
    )

    with Hindsight(base_url=base_url, api_key=api_key) as client:
        response = client.retain(
            bank_id=target_bank,
            content=memory_content,
            context="Customer Support Resolution Outcome",
        )

    return {
        "success": response.success,
        "bank_id": response.bank_id,
        "items_count": response.items_count,
        "operation_id": response.operation_id,
        "retained_content": memory_content,
    }
