import { Request, Response } from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import CommAdmin from "../models/commAdmin";

// Handler function to fetch community data
const fetchCommunityData = asyncErrorHandler(async (req: Request, res: Response) => {
    console.log('comm controller fetch fn called')
  const communityData = await CommAdmin.find().populate('communityId');
  console.log('data ',communityData)
  res.status(200).json({ communityData });
});

export {
    fetchCommunityData
};
