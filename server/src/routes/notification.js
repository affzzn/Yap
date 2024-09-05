import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import Notification from "../models/notification.model.js";
const router = express.Router();

router.get("/", verifyJWT, async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/", verifyJWT, async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
