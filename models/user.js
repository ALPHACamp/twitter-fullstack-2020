'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Reply);
      User.hasMany(models.Tweet);
      User.hasMany(models.Like);
      User.hasMany(models.Public);
      // User.belongsToMany(models.User);
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'following_id',
        as: 'Followers',
      });
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'follower_id',
        as: 'Followings',
      });
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'User_id',
        as: 'LikeTweets',
      });
      User.belongsToMany(models.Reply, {
        through: models.Like,
        foreignKey: 'User_id',
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
    is_admin: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User;
};
