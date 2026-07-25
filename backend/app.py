from typing import TypedDict,List,Dict
from langchain_openai import AzureChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()



class CodeReviewState(TypedDict):
    """State that goes through nodes of our graph"""
    code:str
    initial_analysis:str
    issues:List[str]
    final_report:str

class SimpleCodeReviewAgent:
    def __init__(self):
        self.llm=AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION","2024-08-preview"),
        deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME","gpt-4o"),
        temperature=0.3
        )

    def analysis_agent(self,state:CodeReviewState) -> Dict:
        """Step1: Analyse the code"""
        prompt =f"""Analyse the code briefly:
        {state['code']}
        Focus on:purpose, structure and concern.
        """
        response=self.llm.invoke(prompt)
        return {"initial_analysis": response.content}
    