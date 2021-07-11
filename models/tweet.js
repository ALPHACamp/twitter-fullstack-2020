'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tweet.hasMany(models.Like)
      Tweet.hasMany(models.Reply)
      Tweet.hasMany(models.Like)
      Tweet.belongsTo(models.User)

<<<<<<< HEAD
      // Tweet.belongsToMany(models.User, {
      //   through: models.Like,
      //   foreignKey: 'TweetId',
      //   as: 'LikedbyUser'
      // })

=======
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedbyUser'
      })
>>>>>>> 5141afd608b271e9e6f3aacd20df0db52b15f879
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
    replyCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  return Tweet
}