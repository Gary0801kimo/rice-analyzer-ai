import React, { useEffect, useState } from "react";
import "./App.css";
import textConfig from "./config/text_config.json";

const Card = ({ icon, title, description, buttonText }) => (
  <div className="card">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {buttonText && <button>{buttonText}</button>}
  </div>
);

function App() {
  const [texts, setTexts] = useState(null);

  useEffect(() => {
    setTexts(textConfig);
  }, []);

  if (!texts) return <div>載入中...</div>;

  return (
    <div className="app" style={{ backgroundImage: 'url("/bg.jpg")' }}>
      <h1 className="title">米寶寶 AI 鑑米師</h1>
      <div className="card-container">
        <Card icon="📤" {...texts.upload_card} />
        <Card icon="🔍" {...texts.analysis_card} />
        <Card icon="📄" {...texts.report_card} />
      </div>
    </div>
  );
}

export default App;