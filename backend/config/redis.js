


// import Redis from "ioredis";

// let redis = null;

// if (
//   process.env.NODE_ENV === "production" &&
//   process.env.UPTASH_REDIS_URL
// ) {
//   redis = new Redis(process.env.UPTASH_REDIS_URL, {
//     tls: {},
//     maxRetriesPerRequest: 1,
//   });

//   redis.on("connect", () => {
//     console.log("Redis connected");
//   });

//   redis.on("error", (err) => {
//     console.error("Redis error:", err.message);
//   });
// } else {
//   console.log("Redis disabled in local development");
// }

// export default redis;


import Redis from "ioredis";

const redis = process.env.UPSTASH_REDIS_URL
  ? new Redis(process.env.UPSTASH_REDIS_URL)
  : null;

redis?.on("connect", () => {
  console.log("Redis connected");
});

redis?.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export default redis;
