'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    account: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    /*
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikedTweets'
    }), */
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    }),
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    }),
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'toId',
      as: 'Senders'
    }),
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'fromId',
      as: 'Receivers'
    })
  }
  return User
}
