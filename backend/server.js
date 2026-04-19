import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'express-async-errors';

import { connectDB } from './config/db.js';
import { ErrorHandlerMiddleware } from './middleware/ErrorHandlerMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
 origin: [
  'http://localhost:5173',
  process.env.FRONTEND_URL
],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
