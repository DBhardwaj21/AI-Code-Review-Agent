# 🛡️ AI Code Review Agent

> An autonomous multi-agent code review and refactoring workbench powered by **LangGraph**, **FastAPI**, and **Next.js**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![LangGraph](https://img.shields.io/badge/LangGraph-StateGraph-orange)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-3178C6?logo=typescript)

---

## 🌟 Overview

**AI Code Review Agent** is a state-of-the-art developer workspace designed to perform automated static analysis, vulnerability detection, and intelligent refactoring across multiple programming languages. 

Using an agent pipeline architecture, the system passes source code through dedicated graph nodes:
1. **Analyzer Node**: Inspects purpose, syntax structure, and architecture.
2. **Issue Finder Node**: Detects security flaws, memory leaks, race conditions, and anti-patterns.
3. **Report Generator Node**: Synthesizes a structured report, health metrics, refactored clean code, and unit tests.

---

## ✨ Key Features

### 💻 1. Interactive Monospaced Code Workspace
- **Multi-Language Support**: Full support for JavaScript, TypeScript, Python, C++, SQL, Go, and Rust.
- **Bug Presets**: Pre-loaded code samples targeting real-world bugs (SQL Injection, Memory Leaks, Buffer Overflow, React Hook infinite loops).
- **File Upload & Export**: Upload local source files (`.js`, `.py`, `.ts`, `.cpp`, `.sql`) directly into the editor.
- **Editor Utilities**: Line numbering, character/line/file size stats, copy code, and clear workspace tools.

### 🤖 2. Multi-Agent Pipeline Visualizer
- Live visual graph displaying execution nodes (`Analyzer` → `Issue Finder` → `Report Generator`).
- Real-time status indicators, node progress checkmarks, and execution timing metrics.

### 📊 3. Comprehensive Quality Dashboard
- **Code Health Score Gauge**: Dynamic circular meter (0–100) assessing code quality.
- **Metric Pillars**: Highlighting Security Posture, Performance Rating, and Maintainability Index.
- **Severity-Filtered Issues**: Filter detected flaws by severity (*Critical*, *Warning*, *Info*) with actionable fix guidance.

### 🔄 4. AI Refactored Code Diff Viewer
- Side-by-side visual diff comparing original code against AI-optimized code.
- **1-Click Apply Fix**: Instantly replace editor contents with the refactored code.

### 🧪 5. Automated Unit Test Generator
- Generates framework-appropriate test suites tailored to the submitted code:
  - **PyTest** for Python
  - **Jest / Vitest** for JavaScript & TypeScript
  - **GoogleTest (gtest)** for C++
- 1-click **Copy Test Code** and **Download Test File** actions (`.test.js`, `.py`, `.cpp`).

### ⚙️ 6. Reviewer Settings & Focus Modes
- Choose review priorities:
  - 🛡️ **Security & Vulnerabilities Priority** (OWASP top 10, SQL Injection, credentials)
  - ⚡ **Performance & Speed Priority** (Time complexity, memory allocations)
  - 🧪 **Testability & Edge Cases Priority** (Uncaught exceptions, null pointer checks)
  - ✨ **Balanced Comprehensive Review**
- Custom FastAPI Endpoint URL configuration.

### 📜 7. Review Session History
- Slide-over drawer persisting up to 20 past review sessions in `localStorage` for quick retrieval.

---

## 📁 Repository Structure

```
AI Code Review Agent/
├── backend/                  # FastAPI & LangGraph AI Service
│   ├── app.py                # LangGraph StateGraph agent pipeline & API routes
│   └── env/                  # Python virtual environment
│
├── frontend/                 # Modern Next.js 16 Web Workbench
│   ├── app/                  # App Router pages & global styles
│   │   ├── globals.css       # Dark glassmorphism design system & utility classes
│   │   ├── layout.tsx        # App layout wrapper & metadata
│   │   └── page.tsx          # Main dashboard & live workspace
│   ├── components/           # UI Components
│   │   ├── Header.tsx        # Top navbar with logo, status, history & settings
│   │   ├── CodeEditor.tsx    # Monospaced code workspace with preset loader
│   │   ├── AgentPipeline.tsx # Live agent execution graph visualizer
│   │   ├── ReviewSummary.tsx # Circular health score gauge & metric cards
│   │   ├── IssuesList.tsx    # Severity filterable issue breakdown cards
│   │   ├── DiffViewer.tsx    # Side-by-side code diff tool with 1-click apply
│   │   ├── MarkdownReport.tsx# Formatted markdown report viewer & export tools
│   │   ├── TestGenerator.tsx # Automated unit test suite generator
│   │   ├── SettingsModal.tsx # Review focus modes & API configuration modal
│   │   └── HistoryDrawer.tsx # Slide-over past review history session drawer
│   ├── constants/            # Code bug sample presets
│   │   └── presets.ts
│   └── package.json          # Dependencies (React 19, Lucide, Tailwind, Framer Motion)
│
└── .gitignore                # Comprehensive Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.10` or higher
- **npm** or **yarn** / **pnpm**

---

### 1. Backend Setup (FastAPI & LangGraph)

Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend

# Create virtual environment (if not created)
python -m venv env

# Activate environment
# On Windows PowerShell:
.\env\Scripts\Activate.ps1
# On Linux/macOS:
source env/bin/activate

# Install dependencies
pip install fastapi uvicorn langgraph langchain-openai python-dotenv pydantic
```

Create a `.env` file inside the `backend/` directory:

```env
AZURE_OPENAI_ENDPOINT=https://your-azure-openai-endpoint.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_API_VERSION=2024-08-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

Run the backend API server:

```bash
uvicorn app:app --reload --port 8000
```

> **Backend API Docs**: Swagger UI will be available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup (Next.js 16)

Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 **Demo / Offline Mode**: If the backend Python server is offline or unreachable, the frontend automatically activates a client-side simulated review engine so you can test all features immediately!

---

## 🌐 API Endpoint Reference

### `POST /review`

Performs an end-to-end multi-agent code inspection.

**Request Body (`application/json`):**
```json
{
  "code": "function calculateTotal(items) { return items.price; }"
}
```

**Response (`200 OK`):**
```json
{
  "analysis": "Brief initial code analysis and architecture overview...",
  "issues": [
    "- Potential TypeError: items parameter is accessed as an object property instead of an array.",
    "- Missing null validation for unhandled item prices."
  ],
  "report": "### Full Review Report\n..."
}
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, React Markdown.
- **Backend**: FastAPI, LangGraph (`StateGraph`), LangChain OpenAI, Python 3.10+.
- **Design System**: Dark Cyberpunk Glassmorphism with neon glowing border accents.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
