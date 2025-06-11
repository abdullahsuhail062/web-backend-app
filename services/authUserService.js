// services/userService.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser({ username, email, password, avatar = null }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: hashedPassword,
      avatar: avatar || null, // <-- Add avatar field
    },
  });

  return user;
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { name: username } });
}


export async function updateUserProfileData(userId, { username, avatar }) {
  const id = Number(userId)
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: username,  // ✅ Use the correct Prisma field name
      avatar: avatar
    },
    select: { id: true, name: true, avatar: true },
  });

  return updatedUser;
}

export async function fetchUserProfile(userId){
    const id = Number(userId)

  const user = await prisma.user.findUnique({
    where: {id: id},
    select: {email: true, avatar: true}
  })
  return user
}



export async function updateUserProfileDpData(userId, { avatar, username }) {
  const id = Number(userId);
  let updatedUserDp;

  if (avatar && username) {
    updatedUserDp = await prisma.user.update({
      where: { id },
      data: { avatar, name: username },
      select: { id: true, avatar: true, name: true },
    });
  } else if (!avatar && username) {
    updatedUserDp = await prisma.user.update({
      where: { id },
      data: { name: username },
      select: { id: true, name: true },
    });
  } else if (!username && avatar) {
    updatedUserDp = await prisma.user.update({
      where: { id },
      data: { avatar },
      select: { id: true, avatar: true },
    });
  } else {
    throw new Error('No data provided to update.');
  }

  return updatedUserDp;
}


export  async function deleteAccountById(userId) {
    const id = Number(userId)
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return deletedUser;
  }
