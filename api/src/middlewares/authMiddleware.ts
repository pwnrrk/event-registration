import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET variable not found");
  try {
    const data = verify(req.cookies.token, secret);
    (req as any).currentUser = (data as any).user;
    next();
  } catch (err) {
    next(err);
  }
}
