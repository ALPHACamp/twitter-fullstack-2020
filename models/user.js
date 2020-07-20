'use strict';

const tweet = require("./tweet");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)

    
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'userId',
      as: 'Replyer'
    }),

    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'userId',
      as: 'Liker'
    }),
    
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    }),
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
  };
  return User;
};