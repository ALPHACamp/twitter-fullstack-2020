'use strict';
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(189),
      unique: true
    },
    password: DataTypes.STRING(189),
    name: DataTypes.STRING(189),
    avatar: DataTypes.STRING(189),
    introduction: DataTypes.TEXT,
    account: {
      type: DataTypes.STRING(189),
      unique: true
    },
    cover: DataTypes.STRING(189),
    role: {
      type: DataTypes.STRING(189),
      // defaultValue: 'user'
    }
  },
  // 為了通過測試 先mark掉
  //  {
  //   hooks: {
  //     beforeCreate: async (User, next) => {
  //       const password = User.dataValues.password
  //       if (password) {
  //         try {
  //           const salt = await bcrypt.genSalt(10)
  //           User.dataValues.password = await bcrypt.hash(password, salt)
  //         }
  //         catch (error) {
  //           console.log(error)
  //         }
  //       }
  //     },
  //     beforeUpdate: async (User, next) => {
  //       const password = User.dataValues.password
  //       if (password) {
  //         try {
  //           const salt = await bcrypt.genSalt(10)
  //           User.dataValues.password = await bcrypt.hash(password, salt)
  //         }
  //         catch (error) {
  //           console.log(error)
  //         }
  //       }
  //     }
  //   }
  // }, 
  {});
  User.associate = function (models) {
    User.hasMany(models.Tweet, {
      foreignKey: 'UserId',
      as: 'userTweets'
    })
    User.hasMany(models.Reply, {
      foreignKey: 'UserId',
      as: 'replies'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followerId',
      as: 'follower'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followingId',
      as: 'following'
    })
    User.hasMany(models.Like, {
      foreignKey: 'UserId',
      as: 'likes'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'UserLikedTweet'
    })
    User.belongsToMany(models.Tweet, {
      through: models.Reply,
      foreignKey: 'UserId',
      as: 'UserRepliedTweet'
    })
  };
  return User;
};