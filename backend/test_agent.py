import sys
from dotenv import load_dotenv
from resolve_agent import resolve_customer_issue


def main():
    # Ensure Windows console can display UTF-8 characters without CharMap encoding errors
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    load_dotenv()

    # Test issue specified in requirements
    customer_issue = (
        "Customer is getting a 504 Gateway Timeout when exporting a large analytics report."
    )

    print("=" * 70)
    print("ResolveIQ - AI Support Agent Test (Hindsight + Groq)")
    print("=" * 70)
    print(f"Customer Issue:\n  {customer_issue}\n")
    print("Recalling Hindsight memories and querying Groq LLM...")

    try:
        response = resolve_customer_issue(customer_issue)
    except Exception as exc:
        print(f"\nError running resolution agent: {exc}", file=sys.stderr)
        sys.exit(1)

    print("\n" + "=" * 70)
    print("Customer Issue:")
    print(f"  {response.customer_issue}")
    print(f"\nNumber of Hindsight memories recalled: {response.recalled_memories_count}")
    print("=" * 70)
    print("\nAI Recommendation:")
    print("-" * 70)
    print(response.recommendation)
    print("=" * 70)
    print("AI Agent test completed successfully!")


if __name__ == "__main__":
    main()
