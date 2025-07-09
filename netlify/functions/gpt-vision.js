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
          content: "你是一位稻米品質鑑定專家，請依照台灣國家稻米品質標準（如色澤、碎米比例、透明度、異物、蟲蛀、發霉）對圖片中稻米進行檢測，並標示優質區域（綠圈）與中劣區域（紅圈），並提供分析結果以表格格式呈現，並依據各項標準給出總評：優質、中等或劣等。"
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
