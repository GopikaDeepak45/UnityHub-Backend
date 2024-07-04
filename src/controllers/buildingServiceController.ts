import { NextFunction, Request, Response } from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import CommAdmin from "../models/commAdmin";
import BuildingService from "../models/BuildingServices";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { v2 as cloudinary } from 'cloudinary';
import { ConflictError } from "../errors/ConflictError";
import User from "../models/user";

const getBuildingServicesdata=asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const { communityAdminId } = req.query;
console.log('fetch services data',req.query)
    // Find the community admin using communityAdminId
    const commAdmin = await CommAdmin.findById(communityAdminId);

    if (!commAdmin) {
      throw new NotFoundError('Community Admin not found');
    }

    // Assuming commAdmin.communityId contains the ID of the community
    const communityId = commAdmin.communityId;

    // Find building services associated with the communityId
    const buildingServices = await BuildingService.find({ communityId });

    // Respond with the building services data
    res.status(200).json(buildingServices);
})
const getBuildingServicesdataUser=asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
  const { userId } = req.query;
const user=await User.findById(userId)
if(!user){
  throw new NotFoundError('User not found')
}

  // Assuming commAdmin.communityId contains the ID of the community
  const communityId = user.communityId;

  // Find building services associated with the communityId
  const buildingServices = await BuildingService.find({ communityId });

  // Respond with the building services data
  res.status(200).json(buildingServices);
})

 const addBuildingService = asyncErrorHandler(async (req: Request, res: Response) => {
    
  const { name, description, communityAdminId, servicesPerHour} = req.body;

  if (!name || !description || !communityAdminId) {
    throw new BadRequestError("Name, description, and communityId are required");
  }
const commAdmin=await CommAdmin.findById(communityAdminId)
if(!commAdmin){
    throw new NotFoundError('Community admin data not found')
}
// Check if a similar service already exists for the community
const existingService = await BuildingService.findOne({
    name:{ $regex: new RegExp(`^${name}$`, 'i') },
    communityId: commAdmin.communityId,
  });

  if (existingService) {
    throw new ConflictError(`Service name already exists`)
  }
  const newBuildingService = new BuildingService({
    name,
    description,
    communityId:commAdmin.communityId,
    scheduledTimes: [],
    maxServicesPerHour:servicesPerHour
    
  });

  await newBuildingService.save();

  res.status(201).json({ message: 'Building service added successfully', buildingServices: newBuildingService });
});
const deleteBuildingService=asyncErrorHandler(async (req: Request, res: Response) => {
console.log('enter delete service',req.query)
const{id}=req.query
// Check if service ID is provided
if (!id) {
    throw new BadRequestError('Service ID is required');
  }

  const deletedService = await BuildingService.findByIdAndDelete(id as string);

 
  if (!deletedService) {
    throw new NotFoundError('Building service not found');
  }

 
  res.status(200).json({ message: 'Building service deleted successfully', deletedService });

})

const editBuildingService=asyncErrorHandler(async (req: Request, res: Response) => {
  console.log('enter edit service',req.body)
  const { id, name, description, communityAdminId, servicesPerHour } = req.body;

  if (!id || !name || !description || !communityAdminId) {
    throw new BadRequestError("ID, name, description, and communityId are required");
  }

  const commAdmin = await CommAdmin.findById(communityAdminId);
  if (!commAdmin) {
    throw new NotFoundError('Community admin data not found');
  }

  const buildingService = await BuildingService.findById(id);
  if (!buildingService) {
    throw new NotFoundError('Building service not found');
  }

  // Check if the new name conflicts with another service in the same community
  const existingService = await BuildingService.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    communityId: commAdmin.communityId,
    _id: { $ne: id } // Ensure it's not the current service
  });

  if (existingService) {
    throw new ConflictError(`Service name already exists in the community`);
  }

  buildingService.name = name;
  buildingService.description = description;
  buildingService.maxServicesPerHour = servicesPerHour;

  await buildingService.save();

  res.status(200).json({ message: 'Building service updated successfully', buildingService });

})

export {
    getBuildingServicesdata,
    getBuildingServicesdataUser,
    addBuildingService,
    deleteBuildingService,
    editBuildingService

 }