import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(",")[1];
      if (!base64) return;
      setImage(reader.result.toString());

      const res = await fetch("/api/gpt-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 })
      });
      const data = await res.json();
      setReport(data);
    };
    reader.readAsDataURL(file);
  };

  const drawMarks = () => {
    if (!canvasRef.current || !imgRef.current || !report) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const img = imgRef.current;

    canvasRef.current.width = img.width;
    canvasRef.current.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (report?.marks) {
      report.marks.forEach((m: any) => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = m.type === "優質" ? "green" : "red";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  };

  const downloadPDF = () => {
    const el = document.getElementById("report");
    if (el) html2pdf().from(el).save("rice-report.pdf");
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "rgba(255,255,255,0.9)" }}>
      <h1>🌾 米寶寶 AI 鑑米師（Vision 分析）</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {image && (
        <div id="report" style={{ marginTop: "2rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img ref={imgRef} src={image} onLoad={drawMarks} alt="preview" style={{ maxWidth: "100%" }} />
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
          </div>
          <div style={{ marginTop: "1rem" }}>
            {report?.summary && (
              <>
                <p><strong>AI 分析摘要：</strong>{report.summary}</p>
                <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                  <thead style={{ background: "#eee" }}>
                    <tr><td>項目</td><td>數值</td><td>標準</td><td>AI 說明</td></tr>
                  </thead>
                  <tbody>
                    {report.details?.map((row: any, i: number) => (
                      <tr key={i}>
                        <td>{row.name}</td>
                        <td>{row.value}</td>
                        <td>{row.standard}</td>
                        <td>{row.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={downloadPDF} style={{ marginTop: "1rem" }}>📄 下載分析報告</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
