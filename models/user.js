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
      isAdmin: DataTypes.BOOLEAN,
    },
    {},
  );
  User.associate = function (models) {
    User.hasMany(models.Reply);
    User.hasMany(models.Tweet);
    User.hasMany(models.Like);
    // User.belongsToMany(models.User);
  };
  return User;
};
