const router = require("express").Router();

// =====================
// 🧪 TEST ROUTE
// =====================
router.get("/", (req, res) => {
  res.json({ message: "AI Demo Route Working ✅" });
});

// =====================
// 🤖 DEMO GENERATE ROUTE
// =====================
router.post("/generate", async (req, res) => {
  const { idea } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      files: [
        {
          path: "index.html",
          content: "<h1>❌ Missing API Key (Demo Mode)</h1>"
        }
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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Return ONLY JSON like:
[
  { "path": "index.html", "content": "<h1>${idea}</h1>" }
]

Idea: ${idea}`
          }
        ]
      })
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;

    console.log("RAW AI OUTPUT:", text);

    let files;

    try {
      files = JSON.parse(text);
    } catch (e) {
      files = [
        {
          path: "index.html",
          content: text || "<h1>AI Demo Fallback</h1>"
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
