import React, { useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/gpt-vision", { imageBase64: image });
      setResult(res.data.result);
    } catch (err) {
      setResult("⚠️ 分析失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("report");
    if (element) {
      html2pdf().from(element).save("稻米分析報告.pdf");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🌾 稻米品質分析系統</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && <img src={image} alt="preview" style={{ width: 300, marginTop: 10 }} />}
      <div>
        <button onClick={handleAnalyze} disabled={loading || !image}>
          {loading ? "分析中…" : "送出分析"}
        </button>
        {result && (
          <>
            <div id="report" style={{ marginTop: 20, background: "#f8f8f8", padding: 10 }}>
              <h3>📄 分析結果</h3>
              <p>{result}</p>
              {image && <img src={image} alt="分析圖" style={{ width: 200 }} />}
            </div>
            <button onClick={downloadPDF} style={{ marginTop: 10 }}>
              ⬇️ 下載報告 PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
