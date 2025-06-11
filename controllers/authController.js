
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
  updateUserProfileData,
  updateUserProfileDpData,
  deleteAccountById
} from '../services/authUserService.js';

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken.js';
import { validateRegisterUser } from '../validators/authValidator.js';

const prisma = new PrismaClient();


// ✅ Update Avatar + Username (for current user)
export const updateUserProfileDp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar, username } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided.' });
    }

    if (!avatar && !username) {
      return res.status(400).json({ error: 'No update data provided.' });
    }

    const updatedUserDp = await updateUserProfileDpData(userId, { avatar, username });

    if (!updatedUserDp) {
      return res.status(404).json({ error: 'User not found or update failed.' });
    }

    const newToken = generateToken({
      id: updatedUserDp.id,
      username: updatedUserDp.name
    });

    const avatarImage = updatedUserDp.avatar

    return res.status(200).json({ message: 'Profile updated successfully', token: newToken, avatar :avatarImage });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Register User
export const registerUser = async (req, res) => {
  let databaseErrors = {};
  const { username, email, password } = req.body.myData;

  try {
    databaseErrors = validateRegisterUser(req.body.myData);

    if (Object.keys(databaseErrors).length > 0) {
      return res.status(400).json({ databaseErrors });
    }

    if (await findUserByUsername(username)) {
      databaseErrors.username = 'Username already exists';
    }

    if (await findUserByEmail(email)) {
      databaseErrors.email = 'Email already exists';
    }

    if (Object.keys(databaseErrors).length > 0) {
      return res.status(409).json({ databaseErrors }); // 409 Conflict
    }

    const newUser = await createUser({ username, email, password });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.name, avatar: newUser.avatar
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.myData;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ email: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ password: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.name,
      avatar: user.avatar
    });

    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ✅ Fetch User Profile
export const fetchUserProfile = async (req, res) => {
  const userId = req.user.id;


  try {
    const user = await prisma.user.findUnique({where:{id: userId}});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Delete User Account
export const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided.' });
    }

    await deleteAccountById(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
