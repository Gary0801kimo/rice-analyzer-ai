
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "Missing imageBase64" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "請分析這張稻米影像，依據台灣標準分類優質、中等、劣質。" },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 1000
    });

    return res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
