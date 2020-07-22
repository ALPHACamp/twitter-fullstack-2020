'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Tweet.belongsTo(models.User)
      Tweet.hasMany(models.Reply)
      Tweet.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'tweetId',
        as: 'LikedUser'
      })
    }
  }
  Tweet.init(
    {
      UserId: DataTypes.STRING,
<<<<<<< HEAD
      description: DataTypes.TEXT
=======
      description: DataTypes.TEXT,
      replyCount: DataTypes.INTEGER
>>>>>>> ccb3f4f97d97e5bade1f58769b61690252664e76
    },
    {
      sequelize,
      modelName: 'Tweet'
    }
  )
  return Tweet
}
