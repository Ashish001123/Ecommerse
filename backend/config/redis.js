// import Redis from "ioredis";

// const redis = new Redis({
//   port: 6379,                 
//   host: "big-tortoise-14371.upstash.io",
//   username: "default",        
//   password: "ATgjAAIncDIwMjhkYWQ3OTc5NGE0ZWQwODA3OGFmOWJlMmFkNzM0NHAyMTQzNzE",
//   tls: {},                     
// });

// redis.ping()
//   .then(res => console.log("Redis ping:", res)) 
//   .catch(err => console.error("Redis connection error:", err));

// export default redis;


import Redis from "ioredis";

let redis = null;

if (
  process.env.NODE_ENV === "production" &&
  process.env.UPTASH_REDIS_URL
) {
  redis = new Redis(process.env.UPTASH_REDIS_URL, {
    tls: {},
    maxRetriesPerRequest: 1,
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err.message);
  });
} else {
  console.log("Redis disabled in local development");
}

export default redis;
