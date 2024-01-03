import asyncHandler from "express-async-handler";

import { QUIZZ_TRY_COUNT, QuizzState, createQuizz, getRunningQuizz, validateQuizz } from "../services/quizz.js";

/**
 * Démarrage d'un quizz
 */
export const start = asyncHandler(async (req, res) => {
  // Sert à indiquer si un quizz est déjà en cours
  const runningQuizz = await getRunningQuizz(Number(req.user.id));

  res.render("quizz/start.twig", { runningQuizzId: runningQuizz?.id });
});

/**
 * Créér un nouveau quizz, puis le démarre
 */
export const create = asyncHandler(async (req, res) => {
  await createQuizz(req.user.id, req.body.type, Number(req.body.questionCount));
  res.redirect(`/quizz/run`);
});

/**
 * Jouer un quizz
 */
export const run = asyncHandler(async (req, res) => {
  const quizz = req.quizz;

  res.render("quizz/run.twig", {
    quizz,
    remainingTries: QUIZZ_TRY_COUNT - quizz.currentTries + 1,
    quizzProgress: Math.floor((quizz.currentQuestion * 100) / quizz.questionCount)
  });
});

/**
 * Vérifie la réponse d'un quizz
 */
export const validate = asyncHandler(async (req, res) => {
  const quizz = await validateQuizz(req.quizz, req.query.r);

  if (quizz.state === QuizzState.OVER) {
    return res.redirect(`/quizz/${quizz.id}/over`);
  }

  res.redirect(`/quizz/run`);
});

/**
 * Jouer un quizz
 */
export const over = asyncHandler(async (req, res) => {
  const quizz = req.quizz;

  if (quizz.state !== QuizzState.OVER) {
    return res.redirect("/quizz/start");
  }

  res.render("quizz/over.twig", { quizz: req.quizz });
});
