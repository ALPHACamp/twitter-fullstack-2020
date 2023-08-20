'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // user 1->m reply
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      // tweet 1->m reply
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  }
  Reply.init({
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replys',
    underscored: true
  })
  return Reply
}
