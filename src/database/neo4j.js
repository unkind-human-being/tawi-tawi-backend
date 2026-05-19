const neo4j = require("neo4j-driver");
const env = require("../config/env");

const driver = neo4j.driver(
  env.NEO4J_URI,
  neo4j.auth.basic(env.NEO4J_USERNAME, env.NEO4J_PASSWORD)
);

async function verifyNeo4jConnection() {
  await driver.verifyConnectivity();
  console.log("Neo4j connected successfully.");
}

function getSession() {
  return driver.session();
}

async function closeNeo4jConnection() {
  await driver.close();
  console.log("Neo4j connection closed.");
}

module.exports = {
  driver,
  getSession,
  verifyNeo4jConnection,
  closeNeo4jConnection,
};