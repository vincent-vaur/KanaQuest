import express from "express";

import { authMiddleware } from "../services/auth.js";
import { home } from "../controllers/home.js";

const router = express.Router();

router.get("/", authMiddleware, home);

export default router;
