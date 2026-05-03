import { Timestamp } from "bson";
import mongoose from "mongoose";
import { match } from "node:assert";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number']
  },
  Timestamp: true
});

const User = mongoose.model('User', UserSchema);
export default User;