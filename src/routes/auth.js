import express from "express";
import passport from "passport";

import { login, logout, signup } from "../controllers/auth.js";

const router = express.Router();

// Formulaire de connexion
router.get("/login", login);

// Formulaire d'inscription
router.get("/signup", signup);
router.post("/signup", signup);

// Auth Google
router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function(req, res) {
  res.redirect("/");
});

// Auth email / mot de passe
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// Déconnexion
router.get("/logout", logout);

export default router;
