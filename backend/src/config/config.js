import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if(!mongoUri){
    throw new Error('MONGODB_URI (or MONGO_URI) is not defined');
}

const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: mongoUri,
    JWT_SECRET: process.env.JWT_SECRET
};

export default config;