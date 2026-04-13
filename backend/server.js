const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Empire OS Running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/deploy", require("./routes/deploy"));
app.use("/api/stripe", require("./routes/stripe"));
app.use("/api/analytics", require("./routes/analytics"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
