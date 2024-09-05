import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d", // Match the cookie lifespan
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    console.log(error);
  }
};
