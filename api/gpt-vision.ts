export default async function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json({
      result: {
        summary: "樣本品質良好，含少量碎米與劣質米粒。",
        marks: [
          { type: "優質", x: 50, y: 60 },
          { type: "優質", x: 120, y: 100 },
          { type: "中等", x: 200, y: 80 },
          { type: "劣等", x: 300, y: 110 }
        ]
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
