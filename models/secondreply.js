'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Secondreply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Secondreply.belongsTo(models.User)
      Secondreply.belongsTo(models.Reply)

    }
  };
  Secondreply.init({
    UserId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    replyTo: DataTypes.STRING,
    likeCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Secondreply',
  });
  return Secondreply;
};