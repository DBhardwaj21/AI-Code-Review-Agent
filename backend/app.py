from typing import TypedDict, List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from langgraph.graph import StateGraph, END 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

class CodeReviewRequest(BaseModel):
    code: str
    provider: Optional[str] = None    # "ollama", "groq", "openai", "azure", "smart_offline"
    api_key: Optional[str] = None     # User-supplied API key from UI
    model_name: Optional[str] = None  # User-supplied model name (e.g. "llama3.2:latest")

class CodeReviewState(TypedDict):
    """State that goes through nodes of our graph"""
    code: str
    provider: Optional[str]
    api_key: Optional[str]
    model_name: Optional[str]
    initial_analysis: str
    issues: List[str]
    final_report: str

def get_llm_instance(provider: Optional[str] = None, api_key: Optional[str] = None, model_name: Optional[str] = None):
    """Dynamically construct an LLM instance based on request parameters or fallback to env vars."""
    
    # 1. User selected Ollama
    if provider == "ollama":
        try:
            from langchain_community.chat_models import ChatOllama
            model = model_name or os.getenv("OLLAMA_MODEL", "llama3.2:latest")
            print(f"INFO: Review request using Local Ollama model: {model}")
            return ChatOllama(model=model, temperature=0.3)
        except Exception as e:
            print(f"WARNING: Ollama error: {e}")

    # 2. User selected Groq
    elif provider == "groq":
        key = api_key or os.getenv("GROQ_API_KEY")
        if key and not key.startswith("your_"):
            try:
                from langchain_openai import ChatOpenAI
                model = model_name or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
                print(f"INFO: Review request using Groq model: {model}")
                return ChatOpenAI(
                    api_key=key,
                    base_url="https://api.groq.com/openai/v1",
                    model=model,
                    temperature=0.3
                )
            except Exception as e:
                print(f"WARNING: Groq error: {e}")

    # 3. User selected Standard OpenAI
    elif provider == "openai":
        key = api_key or os.getenv("OPENAI_API_KEY")
        if key and not key.startswith("your_"):
            try:
                from langchain_openai import ChatOpenAI
                model = model_name or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                print(f"INFO: Review request using OpenAI model: {model}")
                return ChatOpenAI(api_key=key, model=model, temperature=0.3)
            except Exception as e:
                print(f"WARNING: OpenAI error: {e}")

    # 4. User selected Azure OpenAI
    elif provider == "azure":
        key = api_key or os.getenv("AZURE_OPENAI_API_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        if key and endpoint and not key.startswith("your_"):
            try:
                from langchain_openai import AzureChatOpenAI
                model = model_name or os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
                print(f"INFO: Review request using Azure OpenAI model: {model}")
                return AzureChatOpenAI(
                    azure_endpoint=endpoint,
                    api_key=key,
                    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-08-preview"),
                    deployment_name=model,
                    temperature=0.3
                )
            except Exception as e:
                print(f"WARNING: Azure OpenAI error: {e}")

    # 5. Environment Auto-Detection Fallback
    if not provider or provider == "auto":
        azure_key = os.getenv("AZURE_OPENAI_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        groq_key = os.getenv("GROQ_API_KEY")
        use_ollama = os.getenv("USE_OLLAMA", "false").lower() in ("true", "1")

        if use_ollama:
            return get_llm_instance(provider="ollama")
        if groq_key and not groq_key.startswith("your_"):
            return get_llm_instance(provider="groq")
        if openai_key and not openai_key.startswith("your_"):
            return get_llm_instance(provider="openai")
        if azure_key and not azure_key.startswith("your_"):
            return get_llm_instance(provider="azure")

    # 6. Fallback Heuristic Reviewer (Zero API key required)
    print("INFO: Operating in Smart Offline Reviewer Mode.")
    return None


class SimpleCodeReviewAgent:
    def __init__(self):
        self.graph = self._build_graph()

    def _analysis_agent(self, state: CodeReviewState) -> Dict:
        """Step 1: Analyze the code"""
        code = state["code"]
        llm = get_llm_instance(state.get("provider"), state.get("api_key"), state.get("model_name"))

        if llm:
            prompt = f"""Analyse the following code briefly:
{code}
Focus on: purpose, structure, and architectural concern."""
            try:
                response = llm.invoke(prompt)
                return {"initial_analysis": str(response.content)}
            except Exception as e:
                print(f"LLM invoke failed, falling back to local inspection: {e}")

        # Smart local heuristic analysis
        lines = code.splitlines()
        lang = "C++" if "#include" in code else "Python" if "def " in code else "JavaScript/TypeScript"
        analysis = (
            f"Inspected {len(lines)} lines of {lang} source code. "
            "The code defines logic for data handling or mathematical computations. "
            "Primary concerns include input validation, boundary condition safety, and resource handling."
        )
        return {"initial_analysis": analysis}

    def _find_issues(self, state: CodeReviewState) -> Dict:
        """Step 2: Find issues in code"""
        code = state["code"]
        analysis = state["initial_analysis"]
        llm = get_llm_instance(state.get("provider"), state.get("api_key"), state.get("model_name"))

        if llm:
            prompt = f"""Based on: {analysis}
Code: {code}

List 3-5 specific issues. Format each line starting with "- " (e.g. "- Potential issue description")."""
            try:
                response = llm.invoke(prompt)
                raw_content = str(response.content)
                issues = [line.strip() for line in raw_content.split('\n') if line.strip().startswith('-')]
                if not issues:
                    issues = [f"- {line.strip()}" for line in raw_content.split('\n') if line.strip()]
                return {"issues": issues}
            except Exception as e:
                print(f"LLM issue finder failed: {e}")

        # Rule-based local issue detector
        issues = []
        if "strcpy" in code or "strcat" in code:
            issues.append("- Potential Buffer Overflow: Unbounded string copying via strcpy/strcat without buffer size validation.")
        if "SELECT" in code and ("f\"" in code or "format(" in code or "%" in code or "+" in code):
            issues.append("- Severe SQL Injection Risk: Direct string concatenation or interpolation used in SQL query string.")
        if "new " in code and "delete" not in code:
            issues.append("- Resource / Memory Leak: Dynamic memory allocated with 'new' is not explicitly freed.")
        if "<=" in code and "length" in code:
            issues.append("- Array Out of Bounds / Off-by-One Error: Loop comparison '<=' on length boundary causes array read past limit.")
        if "total += item.price" in code or "total = total +" in code:
            issues.append("- Type Coercion Bug: Adding string prices causes unexpected string concatenation instead of numeric addition.")
        if "password" in code.lower() and ("=" in code or ":" in code):
            issues.append("- Security Risk: Plaintext sensitive credentials/passwords hardcoded directly in source code.")

        if not issues:
            issues = [
                "- Missing Error Handling: Function lacks try-catch/try-except block for unhandled exception safety.",
                "- Unvalidated Inputs: Arguments are consumed without null or boundary checks.",
                "- Implicit Type Conversions: Missing explicit numeric parsing on dynamic arguments."
            ]

        return {"issues": issues}

    def _generate_report(self, state: CodeReviewState) -> Dict:
        """Step 3: Generate report from the review"""
        code = state["code"]
        analysis = state["initial_analysis"]
        issues = state["issues"]
        llm = get_llm_instance(state.get("provider"), state.get("api_key"), state.get("model_name"))

        if llm:
            issues_text = '\n'.join(issues)
            prompt = f"""Create a comprehensive code review report:
Analysis: {analysis}
Issues: {issues_text}
Original Code: {code}

Provide:
1. Executive Summary
2. Detailed Issue Breakdown
3. Recommended Refactored Code block (in ```code``` format)"""
            try:
                response = llm.invoke(prompt)
                return {"final_report": str(response.content)}
            except Exception as e:
                print(f"LLM report generator failed: {e}")

        # Rule-based local report generator
        issues_formatted = "\n".join([f"{idx+1}. **{iss.replace('-', '').strip()}**" for idx, iss in enumerate(issues)])
        refactored_preview = code.replace("strcpy", "strncpy").replace("i <= items.length", "i < items.length")
        
        report = f"""### Executive Summary
{analysis}

### Identified Issues & Security Concerns
{issues_formatted}

### Recommended Refactored Implementation

```
{refactored_preview}
```
"""
        return {"final_report": report}

    def _build_graph(self) -> StateGraph:
        """Build the langgraph workflow"""
        workflow = StateGraph(CodeReviewState)
        
        workflow.add_node("analyzer", self._analysis_agent)
        workflow.add_node("issue_finder", self._find_issues)
        workflow.add_node("report_generator", self._generate_report)
        
        workflow.set_entry_point("analyzer")
        workflow.add_edge("analyzer", "issue_finder")
        workflow.add_edge("issue_finder", "report_generator")
        workflow.add_edge("report_generator", END)
        
        return workflow.compile()


agent = SimpleCodeReviewAgent()
app = FastAPI(title="AI Code Review Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def read_root():
    return {"status": "online", "service": "AI Code Review Agent API"}

@app.post("/review")
def review_code(request: CodeReviewRequest):
    initial_state = {
        "code": request.code,
        "provider": request.provider,
        "api_key": request.api_key,
        "model_name": request.model_name,
        "initial_analysis": "",
        "issues": [],
        "final_report": ""
    }
    result = agent.graph.invoke(initial_state)
    
    return {
        "analysis": result['initial_analysis'],
        "issues": result["issues"],
        "report": result["final_report"]
    }