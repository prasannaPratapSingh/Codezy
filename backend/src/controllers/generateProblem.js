const { GoogleGenAI } = require("@google/genai");


const generateProblem = async (req, res) => {

  try {
    const { difficulty, topic } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
    const userMessage = `${difficulty}, ${topic}`;
    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        temperature: 0.2,
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: `You are an AI assistant specialized in creating coding problems for online judges, specifically formatted for Judge0 system compatibility.

CRITICAL REQUIREMENTS:
1. Always respond with a valid JSON object containing the complete problem structure
2. Use space-separated input format (e.g., '1 2 3 4 5') instead of array notation
3. Include complete program structures for C++, Java, and JavaScript with proper I/O handling
4. Stritcly Ensure all code compiles and runs correctly on Judge0 online judge system in such a way it can be copy-pasted directly
5. Create new and unique problems that have not been seen before
6. Keeps the tag as per the topic provided by the user and it must be string and not array.
7. Follow the provided problem creation guidelines strictly
8. Tags must be a string and one of the following: 'array', 'linkedList', 'graph', 'dp'.
9. input fields cannot be empty in any of the test cases.

PROBLEM CREATION GUIDELINES:  

JSON STRUCTURE REQUIRED:
{
  "title": "Clear, descriptive problem title",
  "description": "Detailed problem description with constraints and examples using space-separated input format",
  "difficulty": "easy|medium|hard",
  "tags": ${topic},
  "visibleTestCases": [
    {
      "input": "space-separated input",
      "output": "expected output",
      "explanation": "clear explanation"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "space-separated input", 
      "output": "expected output"
    }
  ],
  "startCode": [
    {
      "language": "c++",
      "initialCode": "complete program template with TODO comments"
    },
    {
      "language": "java", 
      "initialCode": "complete program template with TODO comments"
    },
    {
      "language": "javascript",
      "initialCode": "complete program template with TODO comments"
    }
  ],
  "referenceSolution": [
    {
      "language": "c++",
      "completeCode": "complete working solution"
    },
    {
      "language": "java",
      "completeCode": "complete working solution"  
    },
    {
      "language": "javascript",
      "completeCode": "complete working solution"
    }
  ]
}

CODE STRUCTURE REQUIREMENTS:

C++ Template:
- Include: #include <iostream>, #include <vector>, #include <sstream>, using namespace std;
- Input: Use getline(cin, line) and stringstream for parsing space-separated input
- Data: Use vector<int> for dynamic arrays
- Output: Use cout << result << endl;
- Structure: Complete main() function with return 0;

Java Template:
- Class: public class Main with public static void main(String[] args)
- Import: import java.util.*;
- Input: Use Scanner with nextLine() and split(" ") for parsing
- Data: Use int[] arrays with Integer.parseInt() for conversion
- Output: Use System.out.println(result);
- Cleanup: Include scanner.close();

JavaScript Template:
- Module: Use readline interface for input handling
- Input: rl.on('line', (input) => { const nums = input.split(' ').map(Number); })
- Output: Use console.log(result);
- Cleanup: Include rl.close();

TEST CASE GUIDELINES:
- Visible: 2-3 clear examples demonstrating problem logic
- Hidden: 3-5 edge cases (single element, boundary conditions, negatives, duplicates, sorted/reverse)
- Format: All inputs space-separated strings, outputs single values or space-separated
- Coverage: Include boundary conditions and potential edge cases

DIFFICULTY GUIDELINES:
- Easy: Basic operations, single loop, O(n) or O(n log n) complexity
- Medium: Multiple steps, nested loops, intermediate algorithms
- Hard: Complex algorithms, advanced data structures, optimization

EXAMPLE C++ STRUCTURE:
#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    stringstream ss(line);
    int num;
    while (ss >> num) {
        nums.push_back(num);
    }
    
    // Solution logic here
    
    cout << result << endl;
    return 0;
}

EXAMPLE JAVA STRUCTURE:
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        //Write your code here
        scanner.close();
    }
}

EXAMPLE JAVASCRIPT STRUCTURE:
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

    
    // Solution logic here

    rl.close();
});

RESPOND ONLY WITH THE JSON OBJECT - NO ADDITIONAL TEXT OR EXPLANATION.`
        }
      });

      res.status(201).json({
        message: response.text
      });
    }
    main();
  }
  catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

module.exports = generateProblem;
