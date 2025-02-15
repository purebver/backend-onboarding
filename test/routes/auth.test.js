import supertest from "supertest";
import app from "../../src/app.js";

describe("회원가입 및 로그인 테스트", () => {
  it("회원가입 성공", async () => {
    const res = await supertest(app).post("/signup").send({
      username: "JIN HO",
      password: "12341234",
      nickname: "Mentos",
    });
    const role = "ROLE_USER";
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("username", "JIN HO");
    expect(res.body).toHaveProperty("nickname", "Mentos");
    expect(res.body).toHaveProperty("authorities");
  });

  it("로그인 성공", async () => {
    const res = await supertest(app).post("/login").send({
      username: "JIN HO",
      password: "12341234",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("로그인 실패(비밀번호 오류)", async () => {
    const res = await supertest(app).post("/login").send({
      username: "JIN HO",
      password: "12234",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "유저가 존재하지 않거나 비밀번호가 다릅니다."
    );
  });
});
