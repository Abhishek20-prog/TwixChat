import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { getUser, updateUser ,discoveruser , followuser, unfollowuser,sendConnectionRequest,acceptConnectionRequest,getUserConnections,getUserProfiles} from '../controllers/usercontrollers.js';

const userRouter = express.Router();
userRouter.get('/data',protect, getUser);
userRouter.post('/update',upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'profile', maxCount: 1 }]), protect, updateUser);
userRouter.post('/discover',protect, discoveruser);
userRouter.post('/follow',protect, followuser);
userRouter.post('/unfollow',protect, unfollowuser);
userRouter.post('/connect', protect,  sendConnectionRequest);
userRouter.get('/connections', protect, getUserConnections);
userRouter.post('/accept', protect, acceptConnectionRequest);
userRouter.get('/profile', getUserProfiles);

export { userRouter };
