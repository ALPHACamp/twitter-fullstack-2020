'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account: DataTypes.STRING,
      cover: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {},
  );
  User.associate = function (models) {
    User.hasMany(models.Reply);
  };
  return User;
};
