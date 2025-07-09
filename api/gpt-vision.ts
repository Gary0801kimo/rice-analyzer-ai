import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
  }

  // 模擬 GPT 圖像分析結果
  return res.status(200).json({
    result: {
      summary: "使用 OpenAI Vision 分析結果：樣本品質良好。",
      marks: [
        { type: "優質", x: 50, y: 60 },
        { type: "優質", x: 120, y: 100 },
        { type: "中等", x: 200, y: 80 },
        { type: "劣等", x: 300, y: 110 }
      ]
    }
  });
}
