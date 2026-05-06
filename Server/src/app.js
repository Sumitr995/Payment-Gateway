import express from 'express';
import authRoutes from './routes/AuthRoutes.js';

// initialize express app
const app = express();

// middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



// routes
app.use('/api/auth', authRoutes);



export default app;