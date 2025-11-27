
const { createClient } = require("redis");
require("dotenv").config({ quiet: true });

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.connect().catch(console.error);

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("reconnect", () => {
  console.log("Redis reconnected successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});
redisClient.on("disconnected", () => {
  console.error("Redis connection is disconnected");
});

module.exports = redisClient;
