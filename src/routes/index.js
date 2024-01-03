import express from "express";

import auth from "./auth.js";
import home from "./home.js";
import quizz from "./quizz.js";
import user from "./user.js";
import { authMiddleware } from "../services/auth.js";

const router = express.Router();

router.use(auth);
router.use("/", authMiddleware, home);
router.use("/user", authMiddleware, user);
router.use("/quizz", authMiddleware, quizz);

export default router;
