'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.hasMany(models.Reply)
    User.hasMany(models.Message)
    User.hasMany(models.Privatechat)
    User.hasMany(models.Privatechat, { foreignKey: 'relativeId' })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'ReplyTweet'
    })
  };

  return User;
};