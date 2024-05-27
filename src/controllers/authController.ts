import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import Admin from "../models/admin";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import CommAdmin from "../models/commAdmin";


const login = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  let foundUser;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (role === "admin") {

    foundUser = await Admin.findOne({ email });

  }
  if (role === "commAdmin") {
    foundUser = await CommAdmin.findOne({ email }).exec();
  }
  if (role === "user") {
    foundUser = await Admin.findOne({ email }).exec();
  }

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);


  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = generateAccessToken(foundUser.userName, foundUser._id, foundUser.role);
  const refreshToken = generateRefreshToken(foundUser.userName, foundUser._id, foundUser.role);

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "none", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
});

const refresh = asyncErrorHandler(async (req: Request, res: Response) => {
  console.log('refresh route called')

  const cookies = req.cookies;
  let accessToken

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {

      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const { userId, role } = decoded
      let foundUser

      if (role === 'admin') {
        foundUser = await Admin.findById(userId)
      }

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      accessToken = generateAccessToken(foundUser.userName, foundUser._id, foundUser.role);

      res.json({ accessToken });


    }
  );
});

const logout = (req: Request, res: Response) => {
  console.log('log outtt')
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
};

export {
  login,
  refresh,
  logout,
};
