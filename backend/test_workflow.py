import sys
from dotenv import load_dotenv
from resolve_workflow import handle_customer_issue, record_case_outcome


def main():
    # Ensure Windows console supports UTF-8 characters without CharMap encoding errors
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    load_dotenv()

    print("=" * 75)
    print("ResolveIQ - Complete Learning Workflow Test")
    print("=" * 75)

    # -------------------------------------------------------------------------
    # PHASE 1 — New customer issue
    # -------------------------------------------------------------------------
    customer_issue = (
        "Customer is getting a 504 Gateway Timeout when exporting a large analytics report."
    )
    print("\n[PHASE 1] New Customer Issue Received")
    print("-" * 75)
    print(f"Issue Description:\n  {customer_issue}")

    # -------------------------------------------------------------------------
    # PHASE 2 — Recall + AI Recommendation
    # -------------------------------------------------------------------------
    print("\n[PHASE 2] Recalling Hindsight Memories & Generating AI Recommendation...")
    print("-" * 75)

    try:
        workflow_result = handle_customer_issue(customer_issue)
    except Exception as exc:
        print(f"Error in handle_customer_issue: {exc}", file=sys.stderr)
        sys.exit(1)

    recalled_count = workflow_result.get("recalled_memories_count", 0)
    recommendation = workflow_result.get("recommendation", "")

    print(f"Number of Hindsight memories recalled: {recalled_count}")
    print("\nAI Recommendation:")
    print("-" * 75)
    print(recommendation)

    # -------------------------------------------------------------------------
    # PHASE 3 — Simulated outcome
    # -------------------------------------------------------------------------
    action_taken = (
        "Implemented streaming CSV with cursor-based pagination "
        "and increased the reverse proxy timeout to 180 seconds."
    )
    outcome = "Resolved"
    verification = "100,000-row export completed successfully in 34 seconds without a timeout."

    print("\n[PHASE 3] Simulated Resolution Outcome")
    print("-" * 75)
    print(f"Action Taken : {action_taken}")
    print(f"Outcome      : {outcome}")
    print(f"Verification : {verification}")

    # -------------------------------------------------------------------------
    # PHASE 4 — Learning (Retain into Hindsight)
    # -------------------------------------------------------------------------
    print("\n[PHASE 4] Retaining Outcome into Hindsight for Continuous Learning...")
    print("-" * 75)

    try:
        record_result = record_case_outcome(
            customer_issue=customer_issue,
            action_taken=action_taken,
            outcome=outcome,
            verification_result=verification,
        )
    except Exception as exc:
        print(f"Error in record_case_outcome: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"Hindsight Bank : {record_result.get('bank_id')}")
    print(f"Retain Success : {record_result.get('success')}")

    # -------------------------------------------------------------------------
    # PHASE 5 — Final message
    # -------------------------------------------------------------------------
    print("\n[PHASE 5] Workflow Completion")
    print("=" * 75)
    print("ResolveIQ learned from this outcome and stored the experience in Hindsight.")
    print("=" * 75)


if __name__ == "__main__":
    main()
