import React, { useEffect, useRef } from "react";

export default function RiceAnalyzer({ image, result }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!image || !result || !result.marks) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      result.marks.forEach((mark) => {
        ctx.beginPath();
        ctx.arc(mark.x, mark.y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = mark.type === "優質" ? "green" : "red";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };
  }, [image, result]);

  if (!image || !result) return null;

  const countByType = (type) =>
    result.marks?.filter((m) => m.type === type).length || 0;

  return (
    <div>
      <div className="relative inline-block">
        <img ref={imgRef} src={image} alt="Rice sample" className="max-w-full" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        ></canvas>
      </div>
      <div className="mt-4 text-left text-sm bg-white bg-opacity-80 p-2 rounded">
        <p className="font-bold mb-1">分析摘要：</p>
        <p>{result.summary}</p>
        <p className="mt-2 font-bold">分類統計：</p>
        <ul>
          <li>✅ 優質：{countByType("優質")} 粒</li>
          <li>⚠️ 中等：{countByType("中等")} 粒</li>
          <li>❌ 劣等：{countByType("劣等")} 粒</li>
        </ul>
      </div>
    </div>
  );
}
