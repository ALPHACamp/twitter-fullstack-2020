'use strict';

const tweet = require('./tweet');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.STRING,
      role: DataTypes.STRING,
      account: DataTypes.STRING
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Tweet);
    User.hasMany(models.Reply);
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'UserLike'
    });
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    });
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    });
  };
  return User;
};
