import express from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/auth.router.js";
import { swaggerUi, docs } from "./swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/", [AuthRouter]);

app.use("/", swaggerUi.serve, swaggerUi.setup(docs));

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열림");
});

export default app;
