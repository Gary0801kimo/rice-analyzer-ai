
import React, { useState } from "react";
import textConfig from "./config/text_config.json";
import "./App.css";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleImageChange = (e) => {
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
    const res = await fetch("/.netlify/functions/gpt-vision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: image }),
    });
    const data = await res.json();
    setResult(data.result || "分析失敗，請稍後再試");
  };

  return (
    <div className="app" style={{ backgroundImage: 'url(bg.jpg)' }}>
      <h1>米寶寶 AI 鑑米師</h1>
      <div className="cards">
        <div className="card">
          <h2>{textConfig.upload_card.title}</h2>
          <p>{textConfig.upload_card.description}</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="card">
          <h2>{textConfig.analysis_card.title}</h2>
          <p>{textConfig.analysis_card.description}</p>
          <button onClick={handleAnalyze}>{textConfig.analysis_card.button}</button>
        </div>
        <div className="card">
          <h2>{textConfig.report_card.title}</h2>
          <p>{textConfig.report_card.description}</p>
        </div>
      </div>
      <div className="result">
        <h3>分析結果：</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}
