const router = require("express").Router();

// =====================
// 🧪 TEST ROUTE
// =====================
router.get("/", (req, res) => {
  res.json({ message: "AI Demo Route Working ✅" });
});

// =====================
// 🤖 AI GENERATE (FINAL)
// =====================
router.post("/generate", async (req, res) => {
  const { idea } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      files: [
        { path: "index.html", content: "<h1>❌ Missing API Key</h1>" }
      ]
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Return ONLY valid JSON. No emojis."
          },
          {
            role: "user",
            content: `Return JSON:
[
 { "path": "index.html", "content": "<h1>${idea}</h1>" }
]`
          }
        ]
      })
    });

    const data = await response.json();

    let raw = data?.choices?.[0]?.message?.content || "";

    // ✅ SAFE CLEAN
    raw = Buffer.from(raw, "utf-8").toString("utf-8");
    raw = raw.replace(/[^\x00-\x7F]/g, "");

    let files;

    try {
      files = JSON.parse(raw);
    } catch {
      files = [
        {
          path: "index.html",
          content: raw || "<h1>Fallback Output</h1>"
        }
      ];
    }

    res.json({ files });

  } catch (err) {
    res.json({
      files: [
        {
          path: "index.html",
          content: "ERROR: " + err.message
        }
      ]
    });
  }
});

module.exports = router;
