
import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!file || !imagePreview) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/gpt-vision', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: imagePreview }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.content || data);
      } else {
        setError(data.error || '分析失敗');
      }
    } catch (err: any) {
      setError(err.message || '無法連接 AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>🌾 稻米品質分析系統</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: '300px', margin: '1rem 0' }} />}
      <br />
      <button onClick={analyzeImage} disabled={loading}>
        {loading ? '分析中…' : '開始分析'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h2>📋 分析結果報告</h2>
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {result && (
          <div style={{ background: '#f2f2f2', padding: '1rem' }}>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
