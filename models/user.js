'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    background: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Tweet);
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: "UserId",
      as: "LikeTweets"
    });
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: "UserId",
      as: "ReplyTweets"
    });
  };
  return User;
};