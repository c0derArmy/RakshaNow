const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeEmergency = async (description) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
    You are a tactical AI dispatcher for RakshaNow. Read this emergency report: "${description}"
    Classify it strictly as: MEDICAL, FIRE, POLICE, or UNKNOWN.
    Respond ONLY in JSON format like this: { "classification": "MEDICAL", "summary": "brief summary" }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
};

module.exports = { analyzeEmergency };