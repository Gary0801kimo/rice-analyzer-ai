const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { imageBase64 } = body;
    if (!imageBase64) return { statusCode: 400, body: JSON.stringify({ error: "No image provided" }) };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位農業品管專家，根據稻米圖像依台灣或日本品質驗證規範分析品質，請從色澤、完整度、飽滿度、異物、破碎比例等面向給出分析，並將優質、中等、劣質特徵以表格列出，使用繁體中文。"
        },
        {
          role: "user",
          content: [{ type: "image_url", image_url: { url: imageBase64 } }]
        }
      ]
    });

    return { statusCode: 200, body: JSON.stringify({ result: response.choices[0].message.content }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "AI 分析錯誤", details: err.message }) };
  }
};
