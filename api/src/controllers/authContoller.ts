import { Request, Response } from "express";
import { checkLogin } from "../repositories/adminRepository";
import { sign, verify } from "jsonwebtoken";
import { add } from "date-fns";

export async function login(req: Request, res: Response) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET variable not found");

  await checkLogin(req.body.username, req.body.password);

  const token = sign({ user: req.body.username }, secret, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: add(Date.now(), { days: 1 }).valueOf(),
  });

  res.json({ message: "ok" });
}

export async function getCurrent(req: Request, res: Response) {
  res.json({ username: (req as any).currentUser });
}

export async function logout(req: Request, res: Response) {
  res.cookie("token", "", { maxAge: Date.now() });
  res.json({ message: "ok" });
}
