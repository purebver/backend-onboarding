import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//유저들 정보 저장
const users = [];

/**
 * @swagger
 * /signup:
 *  post:
 *    summary: 회원가입 API
 *    description: 새로운 유저 등록
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              nickname:
 *                type: string
 *    responses:
 *      201:
 *        description: 회원가입 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: "name"
 *                nickname:
 *                  type: string
 *                  example: "gooddog"
 *                authorities:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      authorityName:
 *                        type: string
 *                        example: "ROLE_USER"
 *      400:
 *        description: 입력 데이터 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "필수입력란에 공란이 있습니다."
 */
router.post("/signup", async (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password || !nickname) {
    return res.status(400).json({ message: "필수입력란에 공란이 있습니다." });
  }
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

/**
 * @swagger
 * /login:
 *  post:
 *    summary: 로그인 API
 *    description: 아이디와 비밀번호를 검증하고 jwt토큰 발급
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: 로그인 성공 (token반환)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjc4NzYzMjAwLCJleHAiOjE2Nzg3NjY4MDB9.4x6GpBjyDq5I5VsK6o7PqjD5of2nX-yA1Bj8_7L7_yM"
 *      401:
 *        description: 인증 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "유저가 존재하지 않거나 비밀번호가 다릅니다."
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
