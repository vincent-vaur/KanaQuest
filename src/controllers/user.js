import asyncHandler from "express-async-handler";

import { saveProfile, getStats } from "../services/user.js";

export const profile = asyncHandler(async (req, res, next) => {
  const stats = await getStats(req.user.id);

  res.render("user/profile.twig", {
    totalPlayed: stats._count.score,
    totalScore: stats._sum.score,
    averageScore: stats._avg.score,
    successRateAverage: stats._avg.successRate
  });
});

/**
 * Modifie le username de l'utilisateur
 */
export const save = asyncHandler(async (req, res) => {
  try {
    const user = await saveProfile(req.user.id, req.body);

    // On reconnecte l'utilisateur pour rafraichir sa session
    req.logIn(user, function(e) {
      if (e) {
        req.flash("error", `Erreur : ${e.message}`);
      } else {
        req.flash("success", "Username modifié");
      }

      res.redirect("/user/profile");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", `Erreur : ${e.message}`);
    res.redirect("/user/profile");
  }
});
