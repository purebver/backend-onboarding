import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("백엔드 온보딩 과제");
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열림");
});
