'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RepliesLikes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RepliesLikes.init({
    UserId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RepliesLikes',
  });
  return RepliesLikes;
};