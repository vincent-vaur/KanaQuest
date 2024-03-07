import express from "express";
import asyncHandler from "express-async-handler";

const router = express.Router();

/**
 * Retourne la date serveur (pour le healthcheck du server)
 */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.send(new Date().toISOString());
  })
);

export default router;
