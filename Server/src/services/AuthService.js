import userModel from '../models/userModel.js';

export const AuthRegisterService = async (name, email, password) => {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    } else {
      // Create new user
      const newUser = new userModel({ name, email, password });
      await newUser.save();
      return { success: true, message: 'User registered successfully' };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

