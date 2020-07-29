'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Like.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      SecondreplyId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Like'
    }
  )
  return Like
}
