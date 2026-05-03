import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/DB.js';

dotenv.config();
await connectDB(); // Call the connectDB function and wait for it to complete
const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

