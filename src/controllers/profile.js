import asyncHandler from "express-async-handler";

export const profile = asyncHandler(async (req, res, next) => {
  res.render("user/profile.twig");
});
