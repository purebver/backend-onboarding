import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const users = [];

router.post("/signup", async (req, res) => {
  const { username, password, nickname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    username,
    password: hashedPassword,
    nickname,
    role: "ROLE_USER",
  };
  users.push(user);

  res.status(201).json({
    username,
    nickname,
    authorities: [{ authorityName: user.role }],
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user || !bcrypt.compare(password, user.password)) {
    return res
      .status(401)
      .json({ message: "유저가 존재하지 않거나 비밀번호가 다릅니다." });
  }

  const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    token,
  });
});
