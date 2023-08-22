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
      Tweet.belongsTo(models.User, { foreignKey: 'user_id' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweet_id' })
      Tweet.hasMany(models.Like, { foreignKey: 'tweet_id' })
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'tweet_id',
        as: 'LikedUsers'
      })
    }
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
