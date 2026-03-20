import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Authentication System API');
});


export default app;