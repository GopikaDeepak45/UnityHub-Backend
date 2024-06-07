import express from 'express';
import { addCorePackage, addImage, deleteCorePackage, deleteImage, editCorePackage } from '../controllers/landingPageControlller';
import verifyToken from '../middlewares/verifyToken';
import { blockCommunity, fetchCommunityData } from '../controllers/communityController';

const router = express.Router();
router.use(verifyToken)

 router.post('/images/addImage',addImage)
 router.post('/images/deleteImage',deleteImage)
 router.get('/community',fetchCommunityData)
 router.post('/community/block',blockCommunity)
 router.post('/packages/addPackage',addCorePackage)
 router.post('/packages/editPackage',editCorePackage)
 router.post('/packages/deletePackage',deleteCorePackage)

export default router;