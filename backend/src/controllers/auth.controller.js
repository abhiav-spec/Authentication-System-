import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

 const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await User.create({ username, email, password: hashedPassword });

        const refreshtoken=jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', refreshtoken, { 
            httpOnly: true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 

        });

        const refreshtokenhash = crypto.createHash('sha256').update(refreshtoken).digest('hex');
        const session = await Session.create({
            user: user._id,
            refreshToken: refreshtokenhash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        const accesstoken = jwt.sign({ 
            id: user._id ,session_id:session._id}, process.env.JWT_SECRET, { expiresIn: '15m' });

        return res.status(201).json({ 
        message: 'User registered successfully' ,
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            acesstoken: accesstoken
        }
    });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getUserProfile = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', newRefreshToken, { 
            httpOnly: true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token not found' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const sessionmodel = await Session.findOneAndDelete({ user: decoded.id });
        
        if(!sessionmodel){
            return res.status(404).json({ error: 'Session not found' });
        }
        sessionmodel.revoked = true;
        await sessionmodel.save();
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export { registerUser, getUserProfile, refreshToken, logout };