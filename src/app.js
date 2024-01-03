import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import flash from "connect-flash";
import createError from "http-errors";
import logger from "morgan";

import routes from "./routes/index.js";
import { initAuthentication } from "./services/auth.js";
import db from "./services/db.js";

// Recreate this constant because its not available in node ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// View engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "twig");

// Logger
app.use(logger("dev"));

// Handle POST requests (from forms and AJAX)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication
initAuthentication(app, db);

// Flash message (see https://github.com/jaredhanson/connect-flash)
app.use(flash());

// Add all flash messages to view templates
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});

// Public directory
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Routes
app.use(routes);

// 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
