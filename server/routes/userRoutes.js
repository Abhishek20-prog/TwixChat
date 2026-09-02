import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import { getUser, updateUser ,discoveruser} from '../controllers/usercontrollers.js';
const userRouter = express.Router();
userRouter.get('/data',protect, getUser);
userRouter.post('/data',upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'profile', maxCount: 1 }]), protect, updateUser);
userRouter.post('/discover',protect, discoveruser);
userRouter.post('/follow',protect, followuser);
userRouter.post('/unfollow',protect, unfollowuser);




