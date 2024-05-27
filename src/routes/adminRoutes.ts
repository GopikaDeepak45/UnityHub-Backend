 import express from 'express';
import { addCorePackage, addImage, deleteImage } from '../controllers/landingPageControlller';
import verifyToken from '../middlewares/verifyToken';
import { fetchCommunityData } from '../controllers/communityController';

const router = express.Router();
router.use(verifyToken)

 router.post('/images/addImage',addImage)
 router.post('/images/deleteImage',deleteImage)
 router.get('/community',fetchCommunityData)
 router.post('/packages/addPackage',addCorePackage)


export default router;
