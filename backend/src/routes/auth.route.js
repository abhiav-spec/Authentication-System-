import {Router} from 'express';
import {registerUser, getUserProfile} from '../controllers/auth.controller.js';
import { get } from 'mongoose';

const router = Router();

router.post('/register', registerUser);
router.get('/profile', getUserProfile);



export default router;