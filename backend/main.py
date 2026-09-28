import sys
from typing import Any, Dict, List, Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from resolve_workflow import handle_customer_issue, record_case_outcome

# Initialize FastAPI application
app = FastAPI(
    title="ResolveIQ API",
    description="Backend API for ResolveIQ - Continuous Learning Customer Support Agent powered by Hindsight and Groq",
    version="1.0.0",
)

# Enable CORS for frontend integrations (e.g., localhost React, Vite, Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------------------------
# Request & Response Schemas
# -----------------------------------------------------------------------------
class ResolveRequest(BaseModel):
    customer_issue: str = Field(
        ...,
        min_length=3,
        description="The customer problem description or support inquiry.",
        examples=["Customer is getting a 504 Gateway Timeout when exporting a large analytics report."]
    )
    language: Literal["English", "Telugu", "Hindi", "Kannada", "Tamil"] = Field(
        default="English",
        description="Language for the generated recommendation.",
    )


class ResolveResponseSchema(BaseModel):
    customer_issue: str
    recalled_memories_count: int
    recalled_memories: List[Dict[str, Any]]
    recommendation: str


class OutcomeRequest(BaseModel):
    customer_issue: str = Field(
        ...,
        min_length=3,
        description="The original customer issue that was addressed.",
    )
    action_taken: str = Field(
        ...,
        min_length=3,
        description="The troubleshooting or remediation action applied.",
    )
    outcome: str = Field(
        ...,
        min_length=2,
        description="The result status (e.g., 'Resolved', 'Workaround Applied').",
    )
    verification_result: str = Field(
        ...,
        min_length=3,
        description="Empirical metrics or verification proving the outcome.",
    )


class OutcomeResponseSchema(BaseModel):
    success: bool
    bank_id: str | None = None
    items_count: int | None = None
    message: str
    retained_content: str | None = None


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
def health_check() -> Dict[str, str]:
    """Health check endpoint to verify API service status."""
    return {
        "status": "ok",
        "service": "ResolveIQ",
    }


@app.post("/api/resolve", response_model=ResolveResponseSchema, tags=["Resolution"])
def resolve_issue(request: ResolveRequest) -> Dict[str, Any]:
    """
    Receives a customer issue, queries Hindsight Cloud for past similar experiences,
    and returns an experience-grounded recommendation synthesized by Groq LLM.
    """
    issue_text = request.customer_issue.strip()
    if not issue_text:
        raise HTTPException(status_code=400, detail="customer_issue cannot be empty.")

    try:
        result = handle_customer_issue(customer_issue=issue_text, language=request.language)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error resolving customer issue: {str(exc)}",
        )


@app.post("/api/outcome", response_model=OutcomeResponseSchema, tags=["Learning"])
def record_outcome(request: OutcomeRequest) -> Dict[str, Any]:
    """
    Records the actual resolution outcome into Hindsight Cloud, allowing ResolveIQ
    to learn from real-world support results for future recall.
    """
    issue = request.customer_issue.strip()
    action = request.action_taken.strip()
    outcome = request.outcome.strip()
    verification = request.verification_result.strip()

    if not all([issue, action, outcome, verification]):
        raise HTTPException(
            status_code=400,
            detail="All fields (customer_issue, action_taken, outcome, verification_result) are required and cannot be empty.",
        )

    try:
        result = record_case_outcome(
            customer_issue=issue,
            action_taken=action,
            outcome=outcome,
            verification_result=verification,
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error recording case outcome: {str(exc)}",
        )
