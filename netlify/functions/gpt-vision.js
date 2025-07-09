const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { imageBase64 } = body;
    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "No image provided" }) };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位農業品管專家，請根據圖片中稻米的外觀進行評估，並依照國家驗證規範（如色澤、透明度、碎米比例、異物、發芽或蟲蛀情況）分類為優質、中等或劣等，並製成表格輸出。使用繁體中文。"
        },
        {
          role: "user",
          content: [{ type: "image_url", image_url: { url: imageBase64 } }]
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "分析失敗", details: err.message })
    };
  }
};
