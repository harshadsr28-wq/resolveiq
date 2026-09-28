import sys
from dotenv import load_dotenv
from hindsight_memory import recall_similar_cases


def main():
    # 1. Load the environment
    load_dotenv()

    # 2. Test query
    query = "Customer has a 504 gateway timeout when exporting a large report"

    print("=" * 70)
    print("ResolveIQ - Hindsight Recall Test")
    print("=" * 70)
    print(f"Test Query: \"{query}\"\n")

    # 3. Call recall_similar_cases
    try:
        results = recall_similar_cases(query)
    except Exception as exc:
        print(f"Error recalling memories: {exc}", file=sys.stderr)
        sys.exit(1)

    # 4. Print retrieved memories and total count
    print(f"Total memories retrieved: {len(results)}")
    print("=" * 70)

    if not results:
        print("No matching memories found in Hindsight bank.")
    else:
        for idx, item in enumerate(results, start=1):
            print(f"\n[Memory #{idx}]")
            print(f"  ID      : {item.get('id')}")
            print(f"  Type    : {item.get('type')}")

            scores = item.get("scores") or {}
            if scores:
                score_parts = [
                    f"{k}={v:.4f}" if isinstance(v, float) else f"{k}={v}"
                    for k, v in scores.items()
                ]
                print(f"  Scores  : {', '.join(score_parts)}")

            if item.get("context"):
                print(f"  Context : {item.get('context')}")

            print(f"  Content :\n    {item.get('text')}")

    print("\n" + "=" * 70)
    print("Recall test completed successfully!")
    print("=" * 70)


if __name__ == "__main__":
    main()
