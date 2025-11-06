import prisma from "../config/prisma";

interface User {
  firstName : string,
  username : string,
  password : string,
}

//samples
export const createUser = async ({firstName,username,password} : User) => {
    return await prisma.user.create({
      data: {
        firstName: firstName,
        username: username,
        password: password,
      }
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
