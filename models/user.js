'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Reply);
      User.hasMany(models.Tweet, {
        foreignKey: 'UserId'
      });
      User.hasMany(models.Like);
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers',
      });
      User.belongsToMany(models.User, {
        through: models.Notifyship,
        foreignKey: 'notifyingId',
        as: 'Notifiers',
      });
      User.belongsToMany(models.User, {
        through: models.Notifyship,
        foreignKey: 'notifiedId',
        as: 'Notifyings',
      });
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings',
      });
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikeTweets',
      });
      User.belongsToMany(models.Reply, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikeReplies',
      });
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User;
};
