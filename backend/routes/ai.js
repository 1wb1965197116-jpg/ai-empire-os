router.get("/", (req, res) => {
  res.json({ message: "AI route working 🤖" });
});const router = require("express").Router();

router.post("/generate", async (req, res) => {
  const { idea } = req.body;

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
        content: `Create SaaS app JSON files only:
[
  {"path":"index.html","content":"<h1>${idea}</h1>"},
  {"path":"style.css","content":"body{font-family:sans-serif}"},
  {"path":"script.js","content":"console.log('AI app')"}
]`
      }]
    })
  });

  const data = await response.json();

  res.json({
    files: JSON.parse(data.choices[0].message.content)
  });
});

module.exports = router;
