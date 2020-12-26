'use strict'
module.exports = (sequelize, DataTypes) => {
  module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      const User = sequelize.define('User', {
        name: {
          name: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        email: {
          email: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        password: {
          password: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        account: {
          account: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        cover: {
          cover: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        avatar: {
          avatar: {
            type: DataTypes.STRING	      type: DataTypes.STRING
          },
        },
        introduction: {
          introduction: {
            type: DataTypes.TEXT	      type: DataTypes.TEXT
          },
        },
        role: {
          role: {
            type: DataTypes.STRING, type: DataTypes.STRING,
            defaultValue: ""	      defaultValue: ""
          }
        }
      }, {})
    }, {})
    User.associate = function (models) {
      User.associate = function (models) {
        User.hasMany(models.Tweet)	    User.hasMany(models.Tweet)
        User.hasMany(models.Reply)	    User.hasMany(models.Reply)
        User.hasMany(models.Like)	    User.hasMany(models.Like)
    /*	    /*
    User.belongsToMany(models.Tweet, {	    User.belongsToMany(models.Tweet, {
      through: models.Like,	      through: models.Like,
      foreignKey: 'UserId',	      foreignKey: 'UserId',
      as: 'LikedTweets'	      as: 'LikedTweets'
    }), */	    }), * /
      User.belongsToMany(User, {
        User.belongsToMany(User, {
          through: models.Followship, through: models.Followship,
          foreignKey: 'followingId', foreignKey: 'followingId',
          as: 'Followers' as: 'Followers'
    }),
      }),
        User.belongsToMany(User, {
          User.belongsToMany(User, {
            through: models.Followship, through: models.Followship,
            foreignKey: 'followerId', foreignKey: 'followerId',
            as: 'Followings' as: 'Followings'
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
        })
    }
  }
  return User	  return User