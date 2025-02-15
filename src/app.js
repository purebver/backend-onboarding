import express from "express";
import dotenv from "dotenv";
import SignRouter from "./routes/sign.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", [SignRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열림");
});
