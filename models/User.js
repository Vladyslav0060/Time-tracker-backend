const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db");
const User = db.define("User", {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    password: {
      type: DataTypes.TEXT,
    },
    date_created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  module.exports = new User()