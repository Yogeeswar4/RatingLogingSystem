const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING(400) },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "user", "store_owner"),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

const Store = sequelize.define(
  "Store",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING(400), allowNull: false },
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
  }
);

const Rating = sequelize.define("Rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  store_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Store, { foreignKey: "owner_id" });
Store.belongsTo(User, { foreignKey: "owner_id" });

User.hasMany(Rating, { foreignKey: "user_id", onDelte: "CASCADE" });
Store.hasMany(Rating, { foreignKey: "store_id", onDelte: "CASCADE" });

Rating.belongsTo(User, { foreignKey: "user_id" });
Rating.belongsTo(Store, { foreignKey: "store_id" });

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password_hash, salt);
  user.password_hash = hashedPassword;
});

module.exports = { sequelize, User, Store, Rating };
