import express from "express";
import verifyToken from "../middlewares/verifyToken";
import { changePassword, getBasicUserInfo, getUserInfo, updateProfile, userRegister, verifyOTP } from "../controllers/userController";
import { fetchGroupsDataUser } from "../controllers/groupsController";
import { addComment, addLike, addPost, deleteLike, fetchPostData } from "../controllers/postController";
import checkUserBlockedStatus from "../middlewares/checkUserBlockedStatus";
import { getBuildingServicesdataUser } from "../controllers/buildingServiceController";

const router = express.Router();

router.post('/register',userRegister)
router.post('/otp',verifyOTP)
//middlewares
router.use(verifyToken)
router.use(checkUserBlockedStatus)

router.get('/basicInfo',getBasicUserInfo)
router.get('/userInfo',getUserInfo)
router.put('/update-profile',updateProfile)
router.put('/change-password',changePassword)
router.get('/groups',fetchGroupsDataUser)
router.get('/posts',fetchPostData)
router.post('/posts/add',addPost)
router.post('/posts/like',addLike)
router.post('/posts/unlike',deleteLike)
router.post('/posts/comment',addComment)
router.get('/building-services',getBuildingServicesdataUser)



export default router;