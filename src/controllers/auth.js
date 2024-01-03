import asyncHandler from "express-async-handler";

import { createAuth } from "../services/auth.js";
import db from "../services/db.js";
import { getUserByEmail } from "../services/user.js";

export const login = asyncHandler(async (req, res, next) => {
  const data = {};

  // Gère le retour après inscription
  if (req.query.success) {
    data.success = "Votre compte a bien été créé";
  }

  // Gère les erreurs de connexion
  if (req.query.error) {
    data.error = "Identifiants invalides";
  }

  res.render("auth/login", data);
});

export const signup = asyncHandler(async (req, res, next) => {
  // Si le formulaire a été soumis
  if (req.body.email) {
    let error = null;
    const { email, username, password, password_confirm } = req.body;

    try {
      if (password !== password_confirm) {
        // Si les mots de passe sont différents
        error = "Les mots de passe sont différents";
      } else if (await getUserByEmail(email)) {
        // Si l'email existe déjà ...
        error = "Ce compte existe déjà";
      }
    } catch (e) {
      error = e;
    }

    // Si il n'y a pas d'erreur
    if (error) {
      return res.render("auth/signup", { error, email, username, password, password_confirm });
    }

    // Création des données d'authentification
    const auth = await createAuth({ email, username }, password, db);

    // On loggue l'utilisateur automatiquement
    req.logIn(auth.user, function(e) {
      if (e) {
        console.log(e);
        return res.redirect("/login");
      }

      res.redirect("/");
    });
  } else {
    res.render("auth/signup");
  }
});

export const logout = asyncHandler(async (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
});
