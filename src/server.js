const app = require("./app");
const env = require("./config/env");
const {
  verifyNeo4jConnection,
  closeNeo4jConnection,
} = require("./database/neo4j");

async function startServer() {
  try {
    await verifyNeo4jConnection();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`API URL: http://localhost:${env.PORT}/v1`);
    });

    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      server.close(async () => {
        await closeNeo4jConnection();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();