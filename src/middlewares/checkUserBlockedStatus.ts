import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { ForbiddenError } from "../errors/ForbiddenError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { BadRequestError } from "../errors/BadRequestError";
import asyncErrorHandler from "./asyncErrorHandler";
import { BlockedError } from "../errors/BlockedError";

const checkUserBlockedStatus = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    

    const userId = req.body.userId || req.query.userId || req.params.userId;
    if (!userId) {
      throw new BadRequestError("User id is required");
    }

    const foundUser = await User.findById(userId).exec();

    if (!foundUser) {
      throw new AuthenticationError();
    }
    console.log("founded from stats block check", foundUser);

    if (foundUser.isBlocked) {
      throw new BlockedError("Your account is blocked. You cannot proceed.");
    }

    next();
  }
);

export default checkUserBlockedStatus;
