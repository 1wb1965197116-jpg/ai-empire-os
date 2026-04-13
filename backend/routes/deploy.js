const router = require("express").Router();

router.post("/", async (req, res) => {
  const { project } = req.body;

  const url = `https://app-${Date.now()}.yourdomain.com`;

  res.json({
    status: "deployed",
    url
  });
});

module.exports = router;
