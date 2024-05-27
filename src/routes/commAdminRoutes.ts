import express from 'express';
import { commAdminRegster, verifyOTP} from "../controllers/commAdminController"


const router = express.Router();


 router.post('/register',commAdminRegster)
 router.post('/otp',verifyOTP)
 
export default router;
