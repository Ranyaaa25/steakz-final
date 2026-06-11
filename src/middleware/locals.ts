import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function setLocals(req: Request, res: Response, next: NextFunction) {
  res.locals.currentUser = req.session.user;
  res.locals.selectedBranch = req.session.selectedBranch;
  res.locals.basketCount = 0;
  if (req.session.user?.role === "customer") {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.session.user.id },
      select: { quantity: true },
    });
    res.locals.basketCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    res.locals.basketCount = (req.session.basket || []).reduce((sum, item) => sum + item.quantity, 0);
  }
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
}
