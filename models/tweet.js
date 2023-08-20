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
      // user 1->m tweet
      Tweet.belongsTo(models.User, { foreignKey: 'userId' })
      Tweet.hasMany(models.Reply, { foreignKey: 'tweetId' })
      // user m->like->m tweet
      Tweet.belongsToMany(models.User, // 多對多關係
        {
          through: models.Like,
          foreignKey: 'tweetId',
          as: 'LikedUsers'
        }
      )
    }
  }
  Tweet.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
    underscored: true
  })
  return Tweet
}
