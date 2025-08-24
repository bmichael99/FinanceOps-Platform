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