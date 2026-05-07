const { prisma } = require("./prisma.config");

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main();
