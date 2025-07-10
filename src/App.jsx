
import React, { useState } from "react";
import text from "./config/text_config.json";
import "./App.css";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("請先上傳圖片");
      return;
    }
    setResult("分析中，請稍候...");
    const res = await fetch("/api/gpt-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: image }),
    });
    const data = await res.json();
    setResult(data.result || "分析失敗");
  };

  return (
    <div className="app" style={{ backgroundImage: 'url(bg.jpg)' }}>
      <h1>米寶寶 AI 鑑米師</h1>
      <div className="card-container">
        <div className="card">
          <h2>{text.upload_card.title}</h2>
          <p>{text.upload_card.description}</p>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {image && <img src={image} alt="預覽" style={{ marginTop: 12, maxWidth: "100%" }} />}
        </div>
        <div className="card">
          <h2>{text.analysis_card.title}</h2>
          <p>{text.analysis_card.description}</p>
          <button onClick={handleAnalyze}>{text.analysis_card.button}</button>
        </div>
        <div className="card">
          <h2>{text.report_card.title}</h2>
          <p>{text.report_card.description}</p>
          <button disabled>{text.report_card.button}</button>
        </div>
      </div>
      <div className="result">
        <h3>分析結果：</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}
