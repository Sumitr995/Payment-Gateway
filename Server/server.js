import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/DB.js';
import app from './src/app.js';

dotenv.config();
await connectDB(); // Call the connectDB function and wait for it to complete
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send("Welcome to the API");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

