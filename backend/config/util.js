// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import redis from "./redis.js";

// dotenv.config();
// export const generateToken = (userId) => {
//   const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });

//   const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: "7d",
//   });

//   return { accessToken, refreshToken };
// };

// export const storeRefreshToken = async (userId, refreshToken) => {
//   try {
//     await redis.set(
//       `refresh_token:${userId}`,
//       refreshToken,
//       "EX",
//       7 * 24 * 60 * 60
//     );
//     console.log("Refresh token stored in Redis ✅");
//   } catch (error) {
//     console.error("Error storing refresh token in Redis:", error);
//   }
// };

// export const setCookie = (res, accessToken, refreshToken) => {
//   res.cookie("accessToken", accessToken, {
//     maxAge: 15 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });

//   res.cookie("refreshToken", refreshToken, {
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });
// };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "./redis.js";

dotenv.config();

export const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.error("Error storing refresh token in Redis:", error);
  }
};

export const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
};
