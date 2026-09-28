import os
import sys
from dotenv import load_dotenv
from fastapi.testclient import TestClient

from main import app


def main():
    # Ensure UTF-8 console output for Windows PowerShell
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")

    load_dotenv()

    client = TestClient(app)

    print("=" * 75)
    print("ResolveIQ - FastAPI Endpoints Integration Test")
    print("=" * 75)

    # -------------------------------------------------------------------------
    # Test 1: GET /health
    # -------------------------------------------------------------------------
    print("\n[Test 1] Testing GET /health...")
    health_resp = client.get("/health")
    print(f"Status Code: {health_resp.status_code}")
    print(f"Response   : {health_resp.json()}")

    assert health_resp.status_code == 200, f"Expected 200, got {health_resp.status_code}"
    health_data = health_resp.json()
    assert health_data.get("status") == "ok", "Expected status == 'ok'"
    assert health_data.get("service") == "ResolveIQ", "Expected service == 'ResolveIQ'"
    print("✓ GET /health PASSED")

    # -------------------------------------------------------------------------
    # Test 2: POST /api/resolve
    # -------------------------------------------------------------------------
    customer_issue = (
        "Customer is getting a 504 Gateway Timeout when exporting a large analytics report."
    )
    print("\n[Test 2] Testing POST /api/resolve...")
    print(f"Customer Issue:\n  {customer_issue}")
    print("Sending request to /api/resolve...")

    resolve_resp = client.post(
        "/api/resolve",
        json={"customer_issue": customer_issue},
    )
    print(f"Status Code: {resolve_resp.status_code}")

    if resolve_resp.status_code != 200:
        print(f"Error Response: {resolve_resp.text}", file=sys.stderr)
        sys.exit(1)

    resolve_data = resolve_resp.json()
    recalled_count = resolve_data.get("recalled_memories_count", 0)
    recommendation = resolve_data.get("recommendation", "")

    print(f"Memories Recalled: {recalled_count}")
    print("\nRecommendation Excerpt:")
    print("-" * 75)
    lines = recommendation.strip().split("\n")
    print("\n".join(lines[:12]))
    if len(lines) > 12:
        print("... [truncated for display] ...")
    print("-" * 75)

    assert "customer_issue" in resolve_data, "Response missing customer_issue"
    assert "recalled_memories" in resolve_data, "Response missing recalled_memories"
    assert "recommendation" in resolve_data, "Response missing recommendation"
    print("✓ POST /api/resolve PASSED")

    # -------------------------------------------------------------------------
    # Test 3: POST /api/outcome
    # -------------------------------------------------------------------------
    outcome_payload = {
        "customer_issue": customer_issue,
        "action_taken": (
            "Implemented streaming CSV with cursor-based pagination "
            "and increased the reverse proxy timeout to 180 seconds."
        ),
        "outcome": "Resolved",
        "verification_result": (
            "100,000-row export completed successfully in 34 seconds without a timeout."
        ),
    }

    print("\n[Test 3] Testing POST /api/outcome...")
    print(f"Payload:\n  Action Taken : {outcome_payload['action_taken']}")
    print(f"  Outcome      : {outcome_payload['outcome']}")
    print(f"  Verification : {outcome_payload['verification_result']}")

    outcome_resp = client.post("/api/outcome", json=outcome_payload)
    print(f"Status Code: {outcome_resp.status_code}")

    if outcome_resp.status_code != 200:
        print(f"Error Response: {outcome_resp.text}", file=sys.stderr)
        sys.exit(1)

    outcome_data = outcome_resp.json()
    print(f"Response: {outcome_data}")

    assert outcome_data.get("success") is True, "Expected success == True"
    assert "message" in outcome_data, "Response missing message"
    print("✓ POST /api/outcome PASSED")

    print("\n" + "=" * 75)
    print("All FastAPI endpoint tests completed successfully!")
    print("=" * 75)


if __name__ == "__main__":
    main()
