import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/DB.js';
import app from './src/app.js';
import logger from './src/utils/logger.js';

dotenv.config();
await connectDB();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Welcome to the Payment Gateway API");
});

app.listen(port, () => {
  logger.info({ port }, 'Server started');
});

