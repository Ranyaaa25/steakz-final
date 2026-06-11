import type { NextFunction, Request, Response } from "express";

export function setLocals(req: Request, res: Response, next: NextFunction) {
  res.locals.currentUser = req.session.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
}

