import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';

export const AuthRegisterService = async (name, email, password) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }
  const newUser = new userModel({ name, email, password });
  await newUser.save();
  return newUser;
};

export const AuthLoginService = async (email, password) => {
  const user = await userModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  return user;
};

