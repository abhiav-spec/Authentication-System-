import {Router} from 'express';
import {registerUser, getUserProfile,refreshToken,logout} from '../controllers/auth.controller.js';
import { get } from 'mongoose';

const router = Router();

router.post('/register', registerUser);
router.get("/refresh-token", refreshToken);
router.get('/profile', getUserProfile);
router.get('/logout', logout);



export default router;