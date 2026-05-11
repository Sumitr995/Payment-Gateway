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
      return newUser;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const AuthLoginService = async (email, password) => {
  try {
    const user = await userModel.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      return user;
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

