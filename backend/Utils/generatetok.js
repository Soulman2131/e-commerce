import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  // Token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set Jwt Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    // samsSite: "strict",
    // Attention c'est sameSITE && non SameSite
    sameSITE: "strict",

    maxAge: 30 * 24 * 60 * 60 * 1000, //30days
  });
};
