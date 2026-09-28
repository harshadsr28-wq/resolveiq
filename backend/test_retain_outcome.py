import sys
from dotenv import load_dotenv
from hindsight_memory import retain_case_outcome


def main():
    # 1. Load the environment
    load_dotenv()

    # 2. Case details specified for the test
    customer_issue = (
        "Customer received a 504 Gateway Timeout while exporting a large analytics report."
    )
    action_taken = (
        "Changed the export endpoint to streaming CSV with cursor-based pagination "
        "and increased the reverse proxy timeout to 180 seconds."
    )
    outcome = "Resolved"
    result = "A 100,000-row export completed successfully in 34 seconds without a timeout."

    print("=" * 70)
    print("ResolveIQ - Hindsight Retain Outcome Test")
    print("=" * 70)
    print(f"Customer Issue : {customer_issue}")
    print(f"Action Taken   : {action_taken}")
    print(f"Outcome        : {outcome}")
    print(f"Result         : {result}")
    print("-" * 70)

    # 3. Retain case outcome in Hindsight
    print("\nRetaining case outcome into Hindsight Cloud...")
    try:
        retain_info = retain_case_outcome(
            customer_issue=customer_issue,
            action_taken=action_taken,
            outcome=outcome,
            result=result,
        )
    except Exception as exc:
        print(f"Error retaining case outcome: {exc}", file=sys.stderr)
        sys.exit(1)

    # 4. Print clear success message and retained memory details
    print("=" * 70)
    print("SUCCESS: Support case outcome retained successfully!")
    print("=" * 70)
    print(f"Bank ID        : {retain_info.get('bank_id')}")
    print(f"Status         : {retain_info.get('success')}")
    print(f"Items Count    : {retain_info.get('items_count')}")
    if retain_info.get("operation_id"):
        print(f"Operation ID   : {retain_info.get('operation_id')}")

    print("\nRetained Memory Content:")
    print("-" * 70)
    print(retain_info.get("retained_content"))
    print("=" * 70)


if __name__ == "__main__":
    main()
