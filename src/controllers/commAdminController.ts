import { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import Community from "../models/community";
import CommAdmin from "../models/commAdmin";
import { BadRequestError } from "../errors/BadRequestError";
import sendEmail from "../utils/sendMail";
import { ConflictError } from "../errors/ConflictError";

const commAdminRegster=asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
 
    const {name,email,password,confirmPassword,mobileNo,communityName,communityLocation}=req.body

    if (password !== confirmPassword) {
      // return res.json({ message: "Passwords do not match" });
      throw new BadRequestError("Passwords do not match");
  }
  // Check if the community already exists
  const existingCommunity = await Community.findOne({ name: communityName, location: communityLocation });
        
  if (existingCommunity) {
    throw new ConflictError('A community with this name and location already exists.');
  }

  const existingCommunityName = await Community.findOne({ name: communityName });
        
  if (existingCommunityName) {
    throw new ConflictError('A community with this name  already exists.');
  }
// Create the community
const community = await Community.create({ name: communityName, location: communityLocation });

//check if mail id exixts
const existingCommAdmin=await CommAdmin.findOne({email})

if(existingCommAdmin){
  throw new ConflictError('Email already exists');
}
   // Create the community admin
   const communityAdmin = await CommAdmin.create({
    role: 'commAdmin',
    userName: name,
    communityId: community._id, // Assign the community ID
    email,
    password,
    mobileNo
});

//generate otp and mail data
const otp = Math.floor(100000 + Math.random() * 900000).toString()
const sub = 'Login OTP'
const msg = `Your OTP for Login : ${otp}`

//save otp
communityAdmin.otp=otp
await communityAdmin.save()

sendEmail(email, sub, msg)

res.status(200).json({ admin_id:communityAdmin._id,message: "Community admin registered successfully" });
})

const verifyOTP=asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const{pin,commAdminId}=req.body

  const commAdmin=await CommAdmin.findById(commAdminId)
  
  if(commAdmin?.otp===pin){
    res.status(200).json({message:'OTP verified'})
  }else{
    throw new BadRequestError('Invalid OTP')
  }
  console.log('verify otp',req.body)

})

export {

  commAdminRegster,
  verifyOTP
};
