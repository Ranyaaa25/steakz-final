import type { NextFunction, Request, Response } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render("404", {
        title: "Access Denied",
        message: "You do not have permission to view this page.",
      });
    }

    next();
  };
}

