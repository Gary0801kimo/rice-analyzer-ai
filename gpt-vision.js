
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const base64Image = body.image;

    if (!base64Image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No image provided" }),
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "請針對稻米品質進行分析並說明依據：" },
            { type: "image_url", image_url: { url: base64Image } }
          ]
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
      body: JSON.stringify({ error: err.message })
    };
  }
};
