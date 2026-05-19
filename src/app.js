const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const v1Routes = require("./routes/v1");
const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Tawi-Tawi Backend API is running.",
    apiVersion: "v1",
    healthCheck: "/v1/health",
  });
});

app.use("/v1", v1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;