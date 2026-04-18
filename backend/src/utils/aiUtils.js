const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeEmergency = async (description) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a tactical AI dispatcher for RakshaNow. Read this emergency report: "${description || 'No description provided'}"
      Classify it strictly as: MEDICAL, FIRE, POLICE, or UNKNOWN.
      Respond ONLY in JSON format like this: { "classification": "MEDICAL", "summary": "brief summary" }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Failed:", error.message);
    // Fallback classification if AI fails
    return { 
      classification: "UNKNOWN", 
      summary: description || "Direct SOS Triggered" 
    };
  }
};

module.exports = { analyzeEmergency };