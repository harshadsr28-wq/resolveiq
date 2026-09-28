import os
import sys
from dotenv import load_dotenv
from hindsight_client import Hindsight

def main():
    # 1. Load environment variables from .env file
    load_dotenv()

    api_key = os.getenv("HINDSIGHT_API_KEY")
    base_url = os.getenv("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
    bank_id = os.getenv("HINDSIGHT_BANK_ID", "resolveiq-support")

    # Validate configuration
    if not api_key or api_key == "your_hindsight_api_key_here":
        print("=" * 70, file=sys.stderr)
        print("ERROR: Missing or placeholder HINDSIGHT_API_KEY.", file=sys.stderr)
        print("Please copy 'backend/.env.example' to 'backend/.env' and set your", file=sys.stderr)
        print("actual Hindsight Cloud API key before running this test.", file=sys.stderr)
        print("=" * 70, file=sys.stderr)
        sys.exit(1)

    print("=" * 70)
    print("ResolveIQ - Hindsight Cloud Connectivity Test")
    print("=" * 70)
    print(f"Base URL : {base_url}")
    print(f"Bank ID  : {bank_id}")
    print("API Key  : [PROTECTED / CONFIGURED]")
    print("-" * 70)

    # 2. Create the Hindsight client
    print("\n[Step 1] Initializing Hindsight client...")
    client = Hindsight(
        base_url=base_url,
        api_key=api_key,
    )
    print("Hindsight client initialized.")

    # 3. Retain one realistic customer-support case
    support_case = (
        "Case #RES-2041: Intermittent 504 Gateway Timeout on Large Report Exports\n"
        "Customer: Acme Corp (Tier 1 Enterprise)\n"
        "Problem: When attempting to export monthly analytics reports containing more than 50,000 records, "
        "the application fails after 60 seconds with an HTTP 504 Gateway Timeout error.\n"
        "Investigation: The report generator microservice loaded all data into memory at once, "
        "exceeding the 60-second reverse proxy timeout before sending headers.\n"
        "Resolution: Refactored export endpoint to use streaming CSV responses with cursor-based pagination "
        "in chunks of 1,000 rows, and tuned upstream proxy timeout to 180 seconds.\n"
        "Verification: Verified 100,000 row export completed in 34 seconds with zero timeouts."
    )

    print("\n[Step 2] Retaining realistic customer-support case...")
    print(f"Target Bank: {bank_id}")
    try:
        retain_resp = client.retain(
            bank_id=bank_id,
            content=support_case,
            context="Customer Support Incident Resolution",
        )
        print(f"Successfully retained case! (success={retain_resp.success})")
    except Exception as exc:
        print(f"\nFailed to retain memory in Hindsight: {exc}", file=sys.stderr)
        sys.exit(1)

    # 4. Recall the case using a related query
    query = "Customer encountering 504 gateway timeout when exporting large reports"
    print(f"\n[Step 3] Recalling memories with query: '{query}'...")
    try:
        recall_resp = client.recall(
            bank_id=bank_id,
            query=query,
        )
    except Exception as exc:
        print(f"\nFailed to recall memory from Hindsight: {exc}", file=sys.stderr)
        sys.exit(1)

    # 5. Print the recalled result clearly
    print("\n" + "=" * 70)
    print(f"RECALLED RESULTS ({len(recall_resp.results)} item(s) found)")
    print("=" * 70)

    if not recall_resp.results:
        print("No matching memories returned for this query.")
    else:
        for index, item in enumerate(recall_resp.results, start=1):
            print(f"\nResult #{index}:")
            print(f"  Memory ID : {item.id}")
            print(f"  Type      : {item.type}")
            if item.scores:
                print(f"  Scores    : {item.scores}")
            print(f"  Content   :\n    {item.text}")

    print("\n" + "=" * 70)
    print("Connectivity test completed successfully!")
    print("=" * 70)

if __name__ == "__main__":
    main()
