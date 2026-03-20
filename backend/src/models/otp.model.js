import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,   
        required: [true, 'Email is required'],  
        unique: [true, 'Email is already registered'],  
    },
    otpHash: {
        type: String,
        required: [true, 'OTP is required'],        
    }   
}, { timestamps: true });

export default mongoose.model('Otp', otpSchema);