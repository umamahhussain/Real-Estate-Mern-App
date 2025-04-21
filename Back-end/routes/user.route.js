import express from "express";
import { updateAvatar } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.put('/update-avatar', verifyToken ,updateAvatar);

export default router;