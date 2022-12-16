'use strict'
<<<<<<< HEAD
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {})
  Tweet.associate = function (models) {
  }
  return Tweet
}
=======
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate(models) {
      Tweet.belongsTo(models.User, { foreignKey: 'UserId'})
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId'})
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'TweetId',
        as: 'LikedUsers'
      })
      Tweet.belongsToMany(models.User, {
        through: models.Reply,
        foreignKey: 'TweetId',
        as: 'RepliedUsers'
      })
    }
  };
  Tweet.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets'
  })
  return Tweet
}
>>>>>>> fe99ea42a98a36c1b067f7d56776b8d43d2f57f4
