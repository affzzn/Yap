import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exisitingUser = await User.findOne({ username });
    if (exisitingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const exisitingEmail = await User.findOne({ email });
    if (exisitingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        likedPosts: newUser.likedPosts,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user?.password || "");

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const t = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      likedPosts: user.likedPosts,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,

      token: t,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.post("/logout", async (req, res) => {
  try {
    // res.cookie("token", "", { maxAge: 0 });

    // res.status(200).json({ message: "Logged out" });

    res.cookie("token", "", { maxAge: 0, httpOnly: true });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/getuser", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
