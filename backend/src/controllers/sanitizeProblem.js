const { GoogleGenAI } = require("@google/genai");

const isDev = process.env.NODE_ENV !== 'production';

const sanitizeProblem = async (req, res) => {
    try {
        const rawCode = req.body.code;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        // Ensure we have a string input
        const userMessage = typeof rawCode === 'string' ? rawCode : JSON.stringify(rawCode);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            config: {
                systemInstruction: `You are a strict JSON validator and code sanitizer & you stictly follows the Judge0 standard input and output rules
STRICTLY FOLLOW THESE RULES:
- Input is a JSON object for a coding problem.
- Remove all documentation comments (/** */, @param, @return).
- Ensure only // TODO appears in starter code.
- Validate that schema fields are correct:
    * difficulty in [easy, medium, hard]
    * tags in [array, linkedList, graph, dp]
    * startCode and referenceSolution exist for java, javascript, c++
- Make sure test cases are consistent with description.
- Return only the cleaned, valid JSON. No extra text.
- Always check each referenceSolution of each langauge with every test cases.
- Make sure the referenceSolution gives expected output for each input test cases.
- If the referenceSolution does not gives expected output make changes in the referenceSolution.
- Make sure the input type follows the Judge0 rules.
- Make sure refereneceSolution follows Judge0 standard rules.`
            },
        });

        // Extract the text from response
        const sanitizedText = response.text;

        res.status(200).json({
            message: sanitizedText
        });

    } catch (err) {
        if (isDev) console.error("Error in sanitizeProblem:", err);
        res.status(500).json({
            message: "Internal server error",
            ...(isDev && { error: err.message })
        });
    }
}

module.exports = sanitizeProblem;