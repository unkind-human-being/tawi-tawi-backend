const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const env = require("./config/env");
const v1Routes = require("./routes/v1");
const swaggerDocument = require("./docs/swagger");
const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/v1/auth", authLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Tawi-Tawi Backend API is running.",
    apiVersion: "v1",
    healthCheck: "/v1/health",
    docs: "/api-docs",
    swaggerJson: "/swagger.json",
  });
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Tawi-Tawi API Docs",
  })
);

app.use("/v1", v1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;