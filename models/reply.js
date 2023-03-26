'use strict';
// Use extending model instead of sequelize.define to define model
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
      // define association here
      Reply.belongsTo(models.User, { foreignKey: 'UserId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    // underscored: true
  })
  return Reply
}
