import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "請幫我分析這張稻米品質，依據台灣國家標準分類為優質、中等、劣質，並指出各區位置。"
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const result = response.choices?.[0]?.message?.content;
    return res.status(200).json({ result });

  } catch (error) {
    console.error("GPT Vision Error:", error);
    return res.status(500).json({ error: "GPT Vision API 錯誤", detail: error.message });
  }
};