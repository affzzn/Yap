import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "You need to login first" });
    }

    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decrypted.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please login again." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please login again." });
    }
    res.status(401).json({ message: "Invalid token. Please login again." });
  }
};

// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";

// export const verifyJWT = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "You need to login first" });
//     }

//     const decrypted = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decrypted) {
//       return res.status(401).json({ message: "You need to login first" });
//     }

//     const user = await User.findById(decrypted.userId);

//     if (!user) {
//       return res.status(401).json({ message: "You need to login first" });
//     }
//     console.log("user (middleware): ", user);

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "You need to login first" });
//   }
// };
