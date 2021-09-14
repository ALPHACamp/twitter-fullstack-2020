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
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Reply)
      Tweet.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'TweetId',
        as: 'FavoritedUsers'
      }),
        Tweet.belongsToMany(models.User, {
          through: models.Like,
          foreignKey: 'TweetId',
          as: 'LikedUsers'
        })
    }
  };
  Tweet.init({
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  return Tweet
}