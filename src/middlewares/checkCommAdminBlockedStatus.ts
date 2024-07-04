import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { ForbiddenError } from "../errors/ForbiddenError";
import { AuthenticationError } from "../errors/AuthenticationError";
import { BadRequestError } from "../errors/BadRequestError";
import asyncErrorHandler from "./asyncErrorHandler";
import CommAdmin from "../models/commAdmin";
import Community from "../models/community";

    const checkCommunityAdminBlockedStatus = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
          const commAdminId = req.body.commAdminId || req.body.commId || req.body.communityAdminId ||
                              req.query.commAdminId || req.query.commId || req.query.communityAdminId ||
                              req.params.commAdminId || req.params.commId || req.params.communityAdminId;
                              
          
          if (!commAdminId) {
            throw new BadRequestError("Community admin id is required");
          }
      
          const foundCommunityAdmin = await CommAdmin.findById(commAdminId).exec();
         
      
          if (!foundCommunityAdmin) {
            throw new AuthenticationError();
          }
          const foundCommunity=await Community.findById(foundCommunityAdmin?.communityId).exec()
         
          if (!foundCommunity) {
            throw new AuthenticationError();
          }
          if (foundCommunity.isBlocked) {
            
            throw new ForbiddenError("Community admin account is blocked");
          }
      
          // Proceed if community admin is not blocked
          next();
        }
      );
      
      export default checkCommunityAdminBlockedStatus;