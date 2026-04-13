const router = require("express").Router();

// ✅ TEST ROUTE (GET)
router.get("/", (req, res) => {
  res.json({ message: "AI route working 🤖" });
});

// ✅ AI GENERATION (POST)
router.post("/generate", async (req, res) => {
  const { idea } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: `Create SaaS app JSON files:
[
  {"path":"index.html","content":"<h1>${idea}</h1>"}
]`
        }]
      })
    });

    const data = await response.json();

    res.json({
      files: JSON.parse(data.choices?.[0]?.message?.content || "[]")
    });

  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
