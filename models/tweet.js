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
    static associate (models) {
      // define association here
      Tweet.belongsToMany(models.Like, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'Likes'
      })
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Reply)
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tweet'
  })
  return Tweet
}