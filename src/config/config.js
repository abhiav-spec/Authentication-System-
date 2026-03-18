import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if(!mongoUri){
    throw new Error('MONGODB_URI (or MONGO_URI) is not defined');
}

const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: mongoUri
};

export default config;