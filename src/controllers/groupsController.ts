import { Request, Response } from "express";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import CommAdmin from "../models/commAdmin";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import Community from "../models/community";
import { ConflictError } from "../errors/ConflictError";
import { v2 as cloudinary } from 'cloudinary';
import Group from "../models/group";
import User from "../models/user";

const fetchGroupsData=asyncErrorHandler(async (req: Request, res: Response) =>{
    console.log('enyter fetc group data',req.query)
    const {communityAdminId}=req.query
    
     const commAdmin = await CommAdmin.findById(communityAdminId);
   
     if (!commAdmin) {
       throw new NotFoundError('Community Admin not found');
     }
   
     // Find the community data using the communityId
     const groups = await Group.find({communityId:commAdmin.communityId})
   
     if (!groups) {
       throw new NotFoundError('Group not found')
     }
     if (!groups || groups.length === 0) {
      // Return an empty array if no groups are found
      return res.status(200).json([]);
    }
   
    // Return the groups
    res.status(200).json(groups);
   })
   const fetchGroupsDataUser=asyncErrorHandler(async (req: Request, res: Response) =>{
    console.log('enyter fetc group data',req.query)
    const {userId}=req.query
    
     const user = await User.findById(userId);
   
     if (!user) {
       throw new NotFoundError('User data not found');
     }
   
     // Find the community data using the communityId
     const groups = await Group.find({communityId:user.communityId})
   
     if (!groups) {
       throw new NotFoundError('Group not found')
     }
     if (!groups || groups.length === 0) {
      // Return an empty array if no groups are found
      return res.status(200).json([]);
    }
   
    // Return the groups
    res.status(200).json(groups);
   })
const addGroupsData= asyncErrorHandler(async (req: Request, res: Response) =>{
  const {name,imageUrl,publicId,shortDescription,commAdminId}=req.body
  console.log('add group req body',req.body)

  const commAdmin=await CommAdmin.findById(commAdminId)
  if(!commAdmin){
    throw new NotFoundError('Community admin not found with given id')
  }

  const existingGroup=await Group.findOne({name:{ $regex: new RegExp(`^${name}$`, 'i') }})
  if(existingGroup){
    throw new ConflictError('Group name already exists')
  }
  const data={
    name,
    communityId:commAdmin.communityId,
    description:shortDescription,
    image:{
      url:imageUrl,
      publicId
    }
  }
  const newGroup=new Group(data)
  await newGroup.save()

 // Add the new group to the community
    const community = await Community.findById(commAdmin.communityId);
    if (!community) {
      throw new NotFoundError('Community not found');
    }

    community.groups.push(newGroup._id);
    await community.save();

    // Respond with the new group data
    res.status(201).json(newGroup);
}) 

const editGroup=asyncErrorHandler(async (req: Request, res: Response) =>{
  console.log('enter edit group',req.body)
  const { id, name, imageUrl, publicId, description } = req.body;

  if (!name) {
    throw new BadRequestError("Group name is required");
  }

  // Find the group by ID
  const group = await Group.findById(id);

  if (!group) {
    throw new NotFoundError('Group not found');
  }
  // Check for existing group with the same name in the community
  const existingGroup = await Group.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    communityId: group.communityId,
    _id: { $ne: id }, // Exclude the current group
  });
  if (existingGroup) {
    throw new ConflictError('Another group with the same name already exists in the community');
  }


  // Store old image data to delete from Cloudinary if the image is changed
  const oldImage = group.image;

  // Make changes
  group.name = name;
  group.description = description;

  // Only update the image if new image data is provided
  if(group.image&&oldImage){
  if (imageUrl && publicId) {
    group.image.url = imageUrl;
    group.image.publicId = publicId;

    // If the image has changed, delete the old image from Cloudinary
    if (oldImage.url !== imageUrl) {
      await cloudinary.uploader.destroy(oldImage.publicId);
    }
  }
    
}

  // Save the updated group
  await group.save();
  res.status(200).send({ message: 'Group updated successfully', group });
})
const deleteGroup=asyncErrorHandler(async (req: Request, res: Response) =>{
  const{id}=req.query//group id
  console.log('delete group',req.query)
  const gg=await Group.findById(id)
  console.log('gottttt',gg)
  const grouopToDelete=await Group.findByIdAndDelete(id)
  if(!grouopToDelete){
    throw new NotFoundError('Group data not found')
  }
  // Remove the group from the associated community
  const updateResult = await Community.updateOne(
    { _id: grouopToDelete.communityId }, // Assuming 'communityId' is a reference in GroupModel
    { $pull: { groups: grouopToDelete._id } } // Assuming 'groups' is an array in CommunityModel
  );

  if (updateResult.modifiedCount === 0)  {
    throw new NotFoundError('Community not found or group not associated with community');
  }

  // Respond with success message
  res.status(200).json({ message: 'Group deleted successfully' });
})

   export{
    fetchGroupsData,
    fetchGroupsDataUser,
    addGroupsData,
    deleteGroup,
    editGroup
   }