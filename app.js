import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRouter.js';

dotenv.config({ path: '.env.development.local' });

const app = express();
const port = 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - Choose ONE of the following:

// Development CORS (open)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Content-Type', 'Authorization'],
  credentials: true
}));

app.use(cors({
  origin: 'https://job-board-webapp.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  credentials: true
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' https://job-board-backend-webapp.vercel.app; script-src 'self'; style-src 'self'");
  next();
});

// Routes
app.use('/users', userRouter);

// Export
export default app;
