import prisma from "./prisma";

//samples
export const createUser = async (firstName,username,password) => {
    return await prisma.user.create({
      data: {
        firstName: firstName,
        username: username,
        password: password,
      }
    });
}

export const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: {username: username}
  });

  return user;
}

export const getUserById = async (userId) => {
  const user = prisma.user.findUnique({
    where: {id: userId}
  });

  return user;
}

export const getUserByRefreshToken = async (token) => {
  const user = prisma.user.findFirst({
    where: {refreshToken: token}
  });

  return user;
}

export const updateUserRefreshToken = async (token, userId) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: token}
  });

  return user;
}

export const updateUserDeleteRefreshToken = async (userId) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: null}
  });

  return user;
}
