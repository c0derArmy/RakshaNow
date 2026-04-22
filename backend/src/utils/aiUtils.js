const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeEmergency = async (description) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log("🤖 [AI] Checking API key...");
  
  if (!apiKey) {
    console.warn("🤖 [AI] GEMINI_API_KEY not set in .env!");
    return { classification: "UNKNOWN", summary: description };
  }

  console.log(`🤖 [AI] API Key found: ${apiKey.substring(0, 10)}...`);
  
  try {
    console.log(`🤖 [AI] Initializing Gemini with description: "${description}"`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Classify this emergency: "${description || 'emergency'}"

Choose: MEDICAL, FIRE, POLICE, CRIME, UNKNOWN

JSON: {"classification": "MEDICAL|FIRE|POLICE|CRIME|UNKNOWN", "summary": "brief"}`;

    console.log("🤖 [AI] Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    console.log("🤖 [AI] Raw response:", text);

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').replace(/`/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    console.log("🤖 [AI] Parsed:", parsed);
    return {
      classification: parsed.classification || "UNKNOWN",
      summary: parsed.summary || description
    };
  } catch (error) {
    console.error("🤖 [AI] ERROR:", error.message);
    return { classification: "UNKNOWN", summary: description };
  }
};

module.exports = { analyzeEmergency };