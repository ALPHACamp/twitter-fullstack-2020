'use strict'
const model = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.STRING,
      role: DataTypes.STRING,
      followerCount: DataTypes.INTEGER,
      followingCount: DataTypes.INTEGER
    }
  )
  User.associate = (models) => {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Secondreply)
    User.hasMany(models.Like)
    // User.belongsToMany(models.Tweet, {
    //   through: models.Like,
    //   foreignKey: 'UserId',
    //   as: 'LikedTweets'
    // })
    // User.belongsToMany(models.Reply, {
    //   through: models.Like,
    //   foreignKey: 'UserId',
    //   as: 'LikedReplies'
    // })
    // User.belongsToMany(models.Secondreply, {
    //   through: models.Like,
    //   foreignKey: 'UserId',
    //   as: 'LikedSecondReplies'
    // })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'FollowingId',
      as: 'Followers'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'FollowerId',
      as: 'Followings'
    })
  }
  return User
}

module.exports = model

// ----- Model init ----
// const { Model } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate (models) {
//       // define association here
//       User.hasMany(models.Tweet)
//       User.hasMany(models.Reply)
//       User.hasMany(models.Secondreply)
//       User.belongsToMany(models.Tweet, {
//         through: models.Like,
//         foreignKey: 'UserId',
//         as: 'LikedTweets'
//       })
//       User.belongsToMany(models.Reply, {
//         through: models.Like,
//         foreignKey: 'UserId',
//         as: 'LikedReplies'
//       })
//       User.belongsToMany(models.Secondreply, {
//         through: models.Like,
//         foreignKey: 'UserId',
//         as: 'LikedSecondReplies'
//       })
//       User.belongsToMany(models.User, {
//         through: models.Followship,
//         foreignKey: 'FollowingId',
//         as: 'Followers'
//       })
//       User.belongsToMany(models.User, {
//         through: models.Followship,
//         foreignKey: 'FollowerId',
//         as: 'Followings'
//       })
//     }
//   }
//   User.init(
//     {
//       account: DataTypes.STRING,
//       name: DataTypes.STRING,
//       email: DataTypes.STRING,
//       password: DataTypes.STRING,
//       avatar: DataTypes.STRING,
//       cover: DataTypes.STRING,
//       introduction: DataTypes.STRING,
//       role: DataTypes.STRING,
//       followerCount: DataTypes.INTEGER,
//       followingCount: DataTypes.INTEGER
//     },
//     {
//       sequelize,
//       modelName: 'User'
//     }
//   )
//   return User
// }
