export interface CodePreset {
  id: string;
  name: string;
  language: string;
  description: string;
  code: string;
}

export const CODE_PRESETS: CodePreset[] = [
  {
    id: "js-ecommerce",
    name: "E-Commerce Total Calculation (JS)",
    language: "javascript",
    description: "Contains floating point inaccuracies, missing null checks, and unhandled string prices.",
    code: `// E-Commerce cart total calculation function
function calculateCartTotal(items, discountCode, taxRate) {
  let total = 0;
  
  // Bug 1: No check if items is array or null
  for (let i = 0; i <= items.length; i++) { // Bug 2: Off-by-one error (<= instead of <)
    let item = items[i];
    // Bug 3: String concatenation if item.price is string ("10" + 5 = "105")
    total += item.price * item.quantity;
  }

  // Bug 4: Hardcoded coupon code logic without validation
  if (discountCode == "SUMMER20") {
    total = total - 20; // Bug 5: Total can become negative if total < 20
  }

  // Bug 6: Floating point precision issue (e.g. 0.1 + 0.2 = 0.30000000000000004)
  let tax = total * taxRate;
  let finalPrice = total + tax;

  return finalPrice; // Returns raw unformatted number
}`
  },
  {
    id: "python-sql",
    name: "User Login & Data Fetch (Python)",
    language: "python",
    description: "Vulnerable to SQL Injection, hardcoded credentials, and missing error logging.",
    code: `import sqlite3
import os

DB_PASSWORD = "AdminPassword123!" # Bug 1: Hardcoded secret credential

def authenticate_and_fetch_profile(user_input_username, user_input_password):
    conn = sqlite3.connect("app_database.db")
    cursor = conn.cursor()

    # Bug 2: Severe SQL Injection vulnerability via string formatting
    query = f"SELECT * FROM users WHERE username = '{user_input_username}' AND password = '{user_input_password}'"
    
    try:
        cursor.execute(query)
        user_data = cursor.fetchone()
        
        # Bug 3: Unhandled empty result leading to TypeError downstream
        if user_data[2] == "admin": 
            print("Admin logged in successfully!")
            
        return user_data
    except Exception as e:
        # Bug 4: Catch-all exception handler swallows errors silently without logging stack trace
        print("An error occurred")
        return None
    finally:
        # Bug 5: Missing conn.close(), leading to database connection leak
        pass`
  },
  {
    id: "ts-react-hook",
    name: "React Data Fetcher Hook (TypeScript)",
    language: "typescript",
    description: "Contains infinite re-render loop, missing cleanup abort controller, and unsafe any casting.",
    code: `import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function useUserData(userId: string) {
  const [data, setData] = useState<any>(null); // Bug 1: Unsafe 'any' type usage
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchOptions = { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } };

  useEffect(() => {
    // Bug 2: Missing AbortController to cancel inflight requests on unmount
    fetch(\`https://api.example.com/users/\${userId}\`, fetchOptions)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, fetchOptions]); // Bug 3: fetchOptions created on every render, causing infinite effect loops!

  return { data, loading, error };
}`
  },
  {
    id: "cpp-memory",
    name: "Buffer Allocation & Pointer (C++)",
    language: "cpp",
    description: "Exhibits memory leaks, dangling pointer dereferences, and buffer overflow potential.",
    code: `#include <iostream>
#include <cstring>

class BufferHandler {
private:
    char* data;
    int size;

public:
    BufferHandler(int s) {
        size = s;
        data = new char[size]; // Allocated dynamically
    }

    // Bug 1: Missing custom Copy Constructor & Assignment Operator (Rule of Three violation)

    void fillData(const char* input) {
        // Bug 2: Potential Buffer Overflow! strcpy does not check input length vs size
        strcpy(data, input); 
    }

    void printData() {
        std::cout << "Buffer Content: " << data << std::endl;
    }

    ~BufferHandler() {
        // Memory freed here
        delete[] data;
    }
};

void processRequest() {
    BufferHandler* buf = new BufferHandler(64);
    buf->fillData("Super Long Input String That Might Exceed Expected Capacity Limits...");
    buf->printData();

    // Bug 3: Memory Leak! Never invoked 'delete buf;' before function exit
}
`
  }
];
