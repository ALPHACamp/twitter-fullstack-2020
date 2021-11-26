'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
  }, {});
  User.associate = function (models) {
    //User.hasMany(models.Followship.followerId)
    //User.hasMany(models.Followship.followingId)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  return User;
};