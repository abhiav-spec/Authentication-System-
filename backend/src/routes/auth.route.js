import {Router} from 'express';
import {registerUser, getUserProfile,refreshToken,logout,logoutAll,login} from '../controllers/auth.controller.js';
import { get } from 'mongoose';

const router = Router();

router.post('/register', registerUser);
router.get("/refresh-token", refreshToken);
router.get('/profile', getUserProfile);
router.get('/logout', logout);
router.get('/logout-all', logoutAll);
router.get('/login',login);



export default router;