'use strict'
const model = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    'Tweet',
    {
      UserId: DataTypes.STRING,
      description: DataTypes.TEXT,
      replyCount: DataTypes.INTEGER,
      likeCount: DataTypes.INTEGER
    }
  )
  Tweet.associate = (models) => {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
    // Tweet.belongsToMany(models.User, {
    //   through: models.Like,
    //   foreignKey: 'TweetId',
    //   as: 'LikedUsers'
    // })
  }

  return Tweet
}

module.exports = model

// ----- Model init ----
// const { Model } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class Tweet extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate (models) {
//       // define association here
//       Tweet.belongsTo(models.User)
//       Tweet.hasMany(models.Reply)
//       Tweet.belongsToMany(models.User, {
//         through: models.Like,
//         foreignKey: 'TweetId',
//         as: 'LikedUsers'
//       })
//     }
//   }
//   Tweet.init(
//     {
//       UserId: DataTypes.STRING,
//       description: DataTypes.TEXT,
//       replyCount: DataTypes.INTEGER,
//       likeCount: DataTypes.INTEGER
//     },
//     {
//       sequelize,
//       modelName: 'Tweet'
//     }
//   )
//   return Tweet
// }
