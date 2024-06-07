import { Request, Response } from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import CommAdmin from "../models/commAdmin";
import Community from "../models/community";
import { NotFoundError } from "../errors/NotFoundError";

// Handler function to fetch community data
const fetchCommunityData = asyncErrorHandler(async (req: Request, res: Response) => {
   
  const communityData = await CommAdmin.find().populate('communityId');
 
  res.status(200).json({ communityData });
});

const blockCommunity=asyncErrorHandler(async (req: Request, res: Response) => {
  const {reason,communityId}=req.body
  console.log('entered block comm',req.body)
  const community=await Community.findById(communityId)

  if(!community){
    throw new NotFoundError()
  }

  community.isBlocked=true
  community.blockReason=reason

  await community.save()

  console.log('community',community)
  res.status(200).json({ message:"ok" });
})

export {
    fetchCommunityData,
    blockCommunity
};
