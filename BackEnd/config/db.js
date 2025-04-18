const Sequlize = require("sequelize");
require("dotenv").config();

const db = new Sequlize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 10000, 
    },
  }
);

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();
module.exports = db;
