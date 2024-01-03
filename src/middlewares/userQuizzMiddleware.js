import { getById } from "../services/quizz.js";

/**
 * Attache le quizz de l'utilisateur courant ayant l'id fournit dans l'url
 * Si non trouvé, renvoie à la page de démarrage d'un quizz
 */
export const userQuizzMiddleware = async (req, res, next) => {
  const quizz = await getById(Number(req.params.id));

  if (!quizz) {
    return res.redirect("/quizz/start");
  }

  req.quizz = quizz;
  next();
};
