import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData } from '../controllers/usercontrollers.js';
const userRouter = express.Router();
userRouter.get('/data',protect, getUserData);