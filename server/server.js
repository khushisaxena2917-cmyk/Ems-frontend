import express from "express";
import connectDB from "./db.js";

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 5000");
});
