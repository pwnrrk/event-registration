import { NextFunction, Request, Response } from "express";
import { createUser, getUsers } from "../repositories/userRepository";
import { IUser } from "../models/user";
import { validationResult } from "express-validator";
import { getFindOptions } from "../libs/findOptions";

export async function index(req: Request, res: Response, next: NextFunction) {
  const users = await getUsers(getFindOptions(req));
  res.json(users);
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const validated = validationResult(req);
  validated.throw();

  const input: IUser = req.body;
  const newUser = await createUser(input);

  res.status(201).json(newUser);
}
