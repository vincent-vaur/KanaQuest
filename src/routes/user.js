import express from "express";

import { profile, save } from "../controllers/user.js";

const router = express.Router();

router.get("/profile", profile);
router.post("/profile", save);

export default router;
