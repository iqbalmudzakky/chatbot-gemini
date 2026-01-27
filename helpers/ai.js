import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

export async function responseForText(prompt) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return response.text;
}

export async function responseForFile(prompt, fileUpload) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        inlineData: {
          mimeType: fileUpload.mimetype,
          data: fileUpload.buffer.toString("base64"), // convert buffer to base64
        },
      },
      { text: prompt },
    ],
  });

  return response.text;
}
