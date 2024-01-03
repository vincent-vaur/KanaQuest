import { getRunningQuizz } from "../services/quizz.js";

/**
 * Attache le quizz courant de l'utilisateur courant à l'objet request.
 * Si non trouvé, renvoie à la page de démarrage d'un quizz
 */
export const userRunningQuizzMiddleware = async (req, res, next) => {
  const runningQuizz = await getRunningQuizz(req.user.id);

  if (!runningQuizz) {
    return res.redirect("/quizz/start");
  }

  req.quizz = runningQuizz;
  next();
};
