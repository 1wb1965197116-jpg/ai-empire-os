import React, { useState } from "react";

export default function App() {
  const API = "https://bb-general-plus-ai-empire-os.onrender.com";

  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [htmlCode, setHtmlCode] = useState("");

  // =====================
  // 🤖 BUILD FROM AI
  // =====================
  const buildApp = async () => {
    setReply("🤖 Generating app...");

    const res = await fetch(API + "/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: input })
    });

    const data = await res.json();

    const file = data.files?.[0];

    if (file) {
      setHtmlCode(file.content);
      setReply("✅ App Generated");
    } else {
      setReply("❌ Failed");
    }
  };

  // =====================
  // 🌐 RUN HTML
  // =====================
  const runHTML = () => {
    const win = window.open();
    win.document.write(htmlCode);
  };

  // =====================
  // 🤖 AUTO BUILD + RUN
  // =====================
  const autoBuildDeploy = async () => {
    await buildApp();
    setTimeout(runHTML, 500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 AI Command Center</h1>

      <textarea
        rows="5"
        style={{ width: "100%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your app..."
      />

      <br /><br />

      <button onClick={buildApp}>🧠 Build App</button>
      <button onClick={runHTML}>🌐 Run</button>
      <button onClick={autoBuildDeploy}>🚀 Auto Build + Run</button>

      <hr />

      <textarea
        rows="10"
        style={{ width: "100%" }}
        value={htmlCode}
        onChange={(e) => setHtmlCode(e.target.value)}
      />

      <pre>{reply}</pre>
    </div>
  );
}
