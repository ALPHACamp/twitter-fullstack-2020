'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING,
    introduction: DataTypes.TEXT
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.hasMany(models.ReplyComment)
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'messageFromId',
      as: 'Receivers'
    })
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'messageToId',
      as: 'Senders'
    })
  };
  return User;
};