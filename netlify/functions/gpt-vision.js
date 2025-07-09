const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function(event, context) {
  try {
    const { imageBase64 } = JSON.parse(event.body);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [{
          type: 'image_url',
          image_url: { url: imageBase64 }
        },
        { type: 'text', text: '請以國家稻米品質分級規範，分析此稻米照片中的碎米比例、色澤、透明度、異物含量，並給出表格與整體等級建議，並標記優質區域（綠圈）、中等與劣質區域（紅圈）。' }]
      }],
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.choices[0].message)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
