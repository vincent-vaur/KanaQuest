import db from "../services/db.js";

/**
 * Nombre de proposition pour les quizz kanas
 */
export const QUIZZ_KANAS_COUNT = 8;

/**
 * Nombre d'essai max par quizz
 */
export const QUIZZ_TRY_COUNT = 3;

/**
 * Quizz types
 */
export const KanaType = {
  HIRAGANAS: "HIRAGANAS",
  KATAKANAS: "KATAKANAS"
};

/**
 * Quizz types
 */
export const QuizzType = {
  HIRAGANAS: "HIRAGANAS",
  KATAKANAS: "KATAKANAS",
  BOTH: "BOTH"
};

/**
 * Quizz statuses
 */
export const QuizzState = {
  NEW: "NEW",
  RUNNING: "RUNNING",
  CANCELLED: "CANCELLED",
  OVER: "OVER"
};

/**
 * Erreurs
 */
export const Errors = {
  QUIZZ_ALREADY_RUNNING: 1
};

/**
 * Retourne un quizz par son identifiant
 */
export const getById = async id => await db.quizz.findFirst({ where: { id } });

/**
 * Sauvegarde un quizz
 */
const save = async quizz => {
  if (quizz.id) {
    const { id, userId, ...data } = quizz;
    return await db.quizz.update({ where: { id }, data });
  }

  return db.quizz.create({ data: quizz });
};

/**
 * Annule un quizz
 */
export const cancelQuizz = async quizzId =>
  await db.quizz.update({
    where: { id: quizzId },
    data: { state: QuizzState.CANCELLED }
  });

/**
 * Démarre un nouveau quizz
 */
export const createQuizz = async (userId, type, questionCount) => {
  // On annule tous les quizz en cours
  await cancelAllRunningQuizz(userId);

  const quizz = { userId, state: QuizzState.RUNNING, type, questionCount, currentTries: 1 };
  await generateQuizzQuestion(quizz);

  return await save(quizz);
};

/**
 * Retourne le quizz en cours pour l'utilisateur donné
 */
export const getRunningQuizz = async userId =>
  await db.quizz.findFirst({
    where: { userId, state: QuizzState.RUNNING }
  });

/**
 * Annule tous les quizz en cours
 */
export const cancelAllRunningQuizz = async userId => {
  await db.quizz.updateMany({ where: { userId, state: QuizzState.RUNNING }, data: { state: QuizzState.CANCELLED } });
};

/**
 * Soumet une réponse à un quizz
 */
export const validateQuizz = async (quizz, chosenKanaId) => {
  const isCorrectAnswer = await validateQuizzResponse(quizz, chosenKanaId);
  const isLastQuestion = quizz.currentQuestion === quizz.questionCount;
  const isLastTry = quizz.currentTries === QUIZZ_TRY_COUNT;
  const canGoToNextQuestion =
    (isCorrectAnswer && !isLastQuestion) || (!isCorrectAnswer && !isLastQuestion && isLastTry);
  const quizzIsOver = isLastQuestion && (isCorrectAnswer || isLastTry);

  quizz.totalTries++;

  if (isCorrectAnswer) {
    quizz.successTries++;
    quizz.score += QUIZZ_TRY_COUNT - quizz.currentTries + 1;
  } else {
    quizz.errorTries++;
  }

  if (!isLastTry) {
    quizz.currentTries++;
  }

  if (canGoToNextQuestion) {
    quizz.currentTries = 1;
    quizz.currentQuestion++;
    await generateQuizzQuestion(quizz);
  }

  if (quizzIsOver) {
    quizz.state = QuizzState.OVER;
    quizz.successRate = calculateSuccessRate(quizz);
  }

  // On sauvegarde le quizz
  return await save(quizz);
};

/**
 * Valide une réponse à un quizz
 */
export const validateQuizzResponse = async (quizz, chosenKanaId) => {
  return Number(chosenKanaId) === Number(quizz.currentKana.id);
};

/**
 * Sélectionne count kanas de manière aléatoire
 */
export const pickRandomKanas = async (type, count = QUIZZ_KANAS_COUNT) =>
  await db.$queryRaw`SELECT * FROM Kanas WHERE type = ${type} ORDER BY RAND() LIMIT ${count}`;

/**
 * Sélectionne count kanas pour le type de quizz donné
 */
export const pickKanasForQuizz = async (quizzType, count = QUIZZ_KANAS_COUNT) => {
  switch (quizzType) {
    case QuizzType.HIRAGANAS:
      return pickRandomKanas(KanaType.HIRAGANAS, count);

    case QuizzType.KATAKANAS:
      return pickRandomKanas(KanaType.KATAKANAS, count);

    // BOTH
    default:
      if (Math.floor(Math.random() * 2) === 0) {
        return pickRandomKanas(KanaType.HIRAGANAS, count);
      }

      return pickRandomKanas(KanaType.KATAKANAS, count);
  }
};

/**
 * Génère une nouvelle question pour le quizz
 */
export const generateQuizzQuestion = async quizz => {
  // Génération des kanas
  quizz.currentChoices = await pickKanasForQuizz(quizz.type);

  // On sélectionne un kanas aléatoirement
  quizz.currentKana = quizz.currentChoices[Math.floor(Math.random() * quizz.currentChoices.length)];

  // On met à jour le quizz
  return quizz;
};

/**
 * Calcule le taux de réussite du quizz
 */
const calculateSuccessRate = quizz => {
  return Math.round((100 * quizz.successTries) / quizz.totalTries);
};
