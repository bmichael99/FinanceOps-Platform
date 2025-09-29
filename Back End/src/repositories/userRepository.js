const prisma = require("./prisma");


//samples
exports.createUser = async (firstName,username,password) => {
  try{
    return await prisma.user.create({
      data: {
        firstName: firstName,
        username: username,
        password: password,
      }
    });
  } catch(err){
    throw err;
  }
}

exports.getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: {username: username}
  });

  return user;
}

exports.getUserById = async (userId) => {
  const user = prisma.user.findUnique({
    where: {id: userId}
  });

  return user;
}

exports.getUserByRefreshToken = async (token) => {
  const user = prisma.user.findFirst({
    where: {refreshToken: token}
  });

  return user;
}

exports.updateUserRefreshToken = async (token, userId) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: token}
  });

  return user;
}

exports.updateUserDeleteRefreshToken = async (userId) => {
  const user = await prisma.user.update({
    where: {id: userId},
    data: {refreshToken: null}
  });

  return user;
}
