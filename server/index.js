import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDb from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoute from './routes/authRoute.js';
import sessionRoute from './routes/sessionRoute.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
    : ['http://localhost:5173', 'http://localhost:3000', 'https://obsidian-conclave.vercel.app'];

const corsOption = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, server-to-server, curl)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            allowedOrigins.includes('*') ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost')
        ) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not permitted by CORS policy`));
    },
    credentials: true,
};

connectDb();

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general API rate limiting to all /api routes
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
    res.send('Obsidian Conclave Server is running');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Obsidian Conclave server is running',
        timestamp: new Date().toISOString(),
    });
});

// Api routes
app.use('/api/auth', authRoute);
app.use('/api/session', sessionRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});