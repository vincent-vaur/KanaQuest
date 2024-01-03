import asyncHandler from "express-async-handler";

export const home = asyncHandler(async (req, res, next) => {
  res.render("home.twig");
});
