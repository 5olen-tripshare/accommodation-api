const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Microservice API",
      version: "1.0.0",
      description: "Documentation de l'API du microservice",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger disponible sur http://localhost:5000/api-docs");
};

module.exports = setupSwagger;
