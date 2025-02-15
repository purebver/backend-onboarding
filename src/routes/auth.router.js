import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//유저들 정보 저장
const users = [];

/*
회원가입
username, password, nickname: 받은정보
hashedPassword: 해싱된 password
user: 유저 데이터
*/
router.post("/signup", async (req, res) => {
  const { username, password, nickname } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    username,
    password: hashedPassword,
    nickname,
    role: "ROLE_USER", // 유저 역할 ex: ROLE_ADMIN, ROLE_USER
  };
  users.push(user);

  res.status(201).json({
    username,
    nickname,
    authorities: [{ authorityName: user.role }],
  });
});

/*
로그인
username, password: 받은정보
token: jwt토큰
*/
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ message: "유저가 존재하지 않거나 비밀번호가 다릅니다." });
  }

  const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  //보통 Bearer를 붙이지만 결과물에 없음
  return res.status(200).json({
    token,
  });
});

export default router;
