// prisma.config.js
const { PrismaClient } = require("@prisma/client"); // CommonJS style

const prisma = new PrismaClient(); // Just default constructor

module.exports = { prisma };
