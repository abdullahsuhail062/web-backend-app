import express from 'express';
const router = express.Router();

import { loginUser, registerUser, fetchUserProfile, updateUserProfile } from "../controllers/authController.js";

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.get('/fetchUserProfile/:id', fetchUserProfile);
router.patch('/updateUserProfile/:usrId', updateUserProfile)

import { loginUser, registerUser, fetchUserProfile, updateUserProfileDp,deleteAccount } from "../controllers/authController.js";
import { authenticateUser } from '../middleware/authMiddleware.js';

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.get('/fetchUserProfile',authenticateUser, fetchUserProfile);
router.patch('/updateUserProfileDp',authenticateUser, updateUserProfileDp)
router.delete('/deleteAccount',authenticateUser, deleteAccount)



export default router; 
