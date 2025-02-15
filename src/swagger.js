import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Onboarding",
      description: "백엔드 온보딩 과제",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/auth.router.js"],
};

const docs = swaggerJSDoc(options);

export { swaggerUi, docs };
