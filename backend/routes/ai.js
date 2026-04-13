const router = require("express").Router();

// ✅ TEST ROUTE
router.get("/", (req, res) => {
  res.json({ message: "AI route working 🤖" });
});

// =====================
// 🤖 AI GENERATE FIXED
// =====================
router.post("/generate", async (req, res) => {
  const { idea } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      files: [
        {
          path: "index.html",
          content: "<h1>Missing OpenAI Key</h1>"
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
            role: "system",
            content:
              "You ONLY return valid JSON. No text, no explanation. Format must be: [ {\"path\":\"index.html\",\"content\":\"...\"} ]"
          },
          {
            role: "user",
            content: `Create a working web app as JSON files only.

Idea: ${idea}

Return ONLY JSON array like:
[
  { "path": "index.html", "content": "<h1>Hello</h1>" },
  { "path": "style.css", "content": "body{font-family:sans-serif;}" },
  { "path": "script.js", "content": "console.log('app running')" }
]`
          }
        ]
      })
    });

    const data = await response.json();

    let raw = data?.choices?.[0]?.message?.content || "";

    console.log("AI RAW OUTPUT:", raw);

    let files;

    try {
      files = JSON.parse(raw);
    } catch (err) {
      // 🔥 SAFE FALLBACK (prevents {"files":[]})
      files = [
        {
          path: "index.html",
          content: raw || "<h1>AI Failed to Generate</h1>"
        }
      ];
    }

    // 🔥 FINAL SAFETY CHECK
    if (!Array.isArray(files)) {
      files = [
        {
          path: "index.html",
          content: String(files)
        }
      ];
    }

    res.json({ files });
  } catch (error) {
    res.json({
      files: [
        {
          path: "index.html",
          content: "Error: " + error.message
        }
      ]
    });
  }
});

module.exports = router;
