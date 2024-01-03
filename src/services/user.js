import db from "./db.js";
import { QuizzState } from "./quizz.js";

/**
 * Modifie les données de profil de l'utilisateur
 */
export const saveProfile = async (userId, data) => {
  if (!data.username) {
    throw new Error("Bad username");
  }

  if (!data.email) {
    throw new Error("Bad email");
  }

  return await db.user.update({ where: { id: userId }, data });
};

/**
 * Retourne le score total d'un utilisateur
 */
export const getStats = async userId => {
  return await db.quizz.aggregate({
    _sum: {
      score: true
    },
    _avg: {
      score: true,
      successRate: true
    },
    _count: {
      score: true
    },
    where: { userId, state: QuizzState.OVER }
  });
};

/**
 * Retourne un utilisateur depuis son email
 */
export const getUserByEmail = async email => await db.user.findFirst({ where: { email } });
