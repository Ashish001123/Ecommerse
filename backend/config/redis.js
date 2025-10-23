// import Redis from "ioredis";

// const redis = new Redis(
//   "rediss://default:ATgjAAIncDIwMjhkYWQ3OTc5NGE0ZWQwODA3OGFmOWJlMmFkNzM0NHAyMTQzNzE@big-tortoise-14371.upstash.io:6379"
// );

// export default redis;


import Redis from "ioredis";

const redis = new Redis({
  port: 6379,                 // Redis port
  host: "big-tortoise-14371.upstash.io",
  username: "default",        // from your URL
  password: "ATgjAAIncDIwMjhkYWQ3OTc5NGE0ZWQwODA3OGFmOWJlMmFkNzM0NHAyMTQzNzE",
  tls: {},                     // enable TLS
});

redis.ping()
  .then(res => console.log("Redis ping:", res)) 
  .catch(err => console.error("Redis connection error:", err));

export default redis;


