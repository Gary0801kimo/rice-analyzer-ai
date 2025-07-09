import React, { useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawMarks = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // 模擬畫紅綠圈
        ctx.strokeStyle = "green";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(80, 80, 30, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(160, 160, 30, 0, 2 * Math.PI);
        ctx.stroke();
      };
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/gpt-vision", { imageBase64: image });
      setResult(res.data.result);
      setTimeout(drawMarks, 500);
    } catch {
      setResult("❌ AI 分析失敗");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("report");
    if (element) {
      html2pdf().from(element).save("稻米品質分析報告.pdf");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>🌾 稻米品質分析系統</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br />
      {image && <canvas ref={canvasRef} style={{ maxWidth: "100%", marginTop: 10 }} />}
      <br />
      <button onClick={analyze} disabled={loading || !image}>
        {loading ? "分析中..." : "開始分析"}
      </button>
      {result && (
        <div id="report" style={{ marginTop: 20, background: "#eee", padding: 10 }}>
          <h3>📋 分析結果報告</h3>
          <p dangerouslySetInnerHTML={{ __html: result }} />
          <button onClick={downloadPDF} style={{ marginTop: 10 }}>⬇️ 下載報告 PDF</button>
        </div>
      )}
    </div>
  );
};

export default App;
