const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { imageBase64 } = body;

    if (!imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No image provided" }),
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位農業品管專家，根據圖像來判斷稻米品質，請依照台灣或日本的稻米品質規範，從色澤、完整度、飽滿度、是否有異物、破碎比例等方面分析，並列出優質、中等、劣質的特徵。請使用繁體中文回覆，並以表格方式呈現。",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      temperature: 0.5,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: response.choices[0].message.content,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "分析錯誤", details: err.message }),
    };
  }
};
