import prisma from "../config/prisma";
import { Prisma } from '../generated/prisma'

//samples
export const createUser = async (userData : Prisma.UserCreateInput) => {
    return await prisma.user.create({
      data: userData,
    });
}

export const getUserByUsername = async (username : string) => {
  const user = await prisma.user.findUnique({
    where: {username: username}
  });

  return user;
}

export const getUserById = async (userId : number) => {
  const user = prisma.user.findUnique({
    where: {id: userId}
  });

  return user;
}

export const getUserByRefreshToken = async (token : string) => {
  const user = prisma.user.findFirst({
    where: {refreshToken: token}
  });

  return user;
}

export const updateUserRefreshToken = async (token : string, userId : number) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: token}
  });

  return user;
}

export const updateUserDeleteRefreshToken = async (userId : number) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: null}
  });

  return user;
}

export const getUserByGoogleId = async (id : string) => {
  const user = prisma.user.findFirst({
    where: {googleUserId: id}
  });

  return user;
}
