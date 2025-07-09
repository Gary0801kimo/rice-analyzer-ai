import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    // 模擬分析結果
    setResult({
      summary: "品質良好，含碎米與劣等米粒。",
      marks: [
        { type: "優質", x: 80, y: 70 },
        { type: "優質", x: 160, y: 100 },
        { type: "中等", x: 220, y: 110 },
        { type: "劣等", x: 300, y: 95 }
      ]
    });
  };

  const drawMarks = () => {
    if (!canvasRef.current || !imgRef.current || !result?.marks) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = imgRef.current;
    if (!ctx) return;

    canvasRef.current.width = img.width;
    canvasRef.current.height = img.height;
    ctx.drawImage(img, 0, 0);
    result.marks.forEach((mark: any) => {
      ctx.beginPath();
      ctx.arc(mark.x, mark.y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = mark.type === "優質" ? "green" : "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const downloadPDF = () => {
    const el = document.getElementById("report");
    if (el) {
      html2pdf().from(el).save("rice-report.pdf");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🌾 米寶寶 AI 鑑米師（完整版）</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && (
        <div id="report" style={{ marginTop: "2rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img ref={imgRef} src={image} onLoad={drawMarks} alt="sample" style={{ maxWidth: "100%" }} />
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p><strong>分析摘要：</strong>{result?.summary}</p>
            <ul>
              <li>✅ 優質：{result?.marks?.filter((m: any) => m.type === "優質").length} 粒</li>
              <li>⚠️ 中等：{result?.marks?.filter((m: any) => m.type === "中等").length} 粒</li>
              <li>❌ 劣等：{result?.marks?.filter((m: any) => m.type === "劣等").length} 粒</li>
            </ul>
            <button onClick={downloadPDF}>📄 下載報告 PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
