const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event) => {
  try {
    const { image } = JSON.parse(event.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "你是一位專業的稻米品質鑑定師，請依據 CNS 國家標準，分析圖片中稻米的品質，說明是否為優質、一般、中等或劣等，並給出品質評分表與摘要。"
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
                detail: "low"
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;

    // 模擬簡單的結構解析（實際需更嚴謹 parser）
    const mockResult = {
      summary: content.split("\n")[0],
      details: [
        { name: "整體飽滿度", value: "92%", standard: "≧90%", comment: "達優質水準" },
        { name: "黃粒比例", value: "1.2%", standard: "≦2%", comment: "低於上限，屬正常" },
        { name: "破碎粒比例", value: "0.5%", standard: "≦1%", comment: "良好" }
      ],
      marks: [
        { x: 80, y: 90, type: "優質" },
        { x: 130, y: 100, type: "中等" }
      ]
    };

    return {
      statusCode: 200,
      body: JSON.stringify(mockResult)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Vision 分析失敗", detail: err.message })
    };
  }
};
