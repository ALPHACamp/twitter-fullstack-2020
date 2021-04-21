'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: {
      allowNull: false,
      unique: true,
      validate: {
        is: { args: /^@.+/, msg: "Account name should start with @" }
      },
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Your email format is incorrect" }
      },
      type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, {});
  User.associate = function (models) {
  };
  return User;
};