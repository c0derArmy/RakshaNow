const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeEmergency = async (description) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Using gemini-1.5-flash for fast and stable classification
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a tactical AI dispatcher for RakshaNow.

Emergency report: "${description || 'No description provided'}"

Classify it strictly into one of:
MEDICAL, FIRE, POLICE, UNKNOWN

Respond ONLY in valid JSON:
{
  "classification": "MEDICAL",
  "summary": "short summary"
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean markdown if exists
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Safe parse
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse failed for AI response:", text);
      return {
        classification: "UNKNOWN",
        summary: description || "Parsing failed"
      };
    }

  } catch (error) {
    console.error("AI Analysis Failed:", error.message);
    return {
      classification: "UNKNOWN",
      summary: description || "Direct SOS Triggered"
    };
  }
};

module.exports = { analyzeEmergency };