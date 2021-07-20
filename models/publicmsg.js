'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicmsg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Publicmsg.belongsTo(models.User)
    }
  };
  Publicmsg.init({
    UserId: DataTypes.INTEGER,
    chat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publicmsg',
  });
  return Publicmsg;
};
