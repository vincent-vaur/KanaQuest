import express from "express";

import * as QuizzController from "../controllers/quizz.js";
import { userRunningQuizzMiddleware } from "../middlewares/userRunningQuizzMiddleware.js";
import { userQuizzMiddleware } from "../middlewares/userQuizzMiddleware.js";

const router = express.Router();

// Formulaire nouveau quizz
router.get("/start", QuizzController.start);
router.post("/start", QuizzController.create);

// Quizz en cours de jeux
router.get("/run", userRunningQuizzMiddleware, QuizzController.run);
router.get("/validate", userRunningQuizzMiddleware, QuizzController.validate);
router.get("/:id/over", userQuizzMiddleware, QuizzController.over);

export default router;
