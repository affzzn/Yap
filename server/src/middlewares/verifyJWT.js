import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You need to login first" });
    }

    const decrypted = jwt.verify(token, process.env.JWT_SECRET);

    if (!decrypted) {
      return res.status(401).json({ message: "You need to login first" });
    }

    const user = await User.findById(decrypted.userId);

    if (!user) {
      return res.status(401).json({ message: "You need to login first" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "You need to login first" });
  }
};
