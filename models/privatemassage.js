'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class privatemassage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      privatemassage.belongsTo(models.User)
    }
  };
  privatemassage.init({
    UserId: DataTypes.INTEGER,
    RecipientId: DataTypes.INTEGER,
    massage: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'privatemassage',
  });
  return privatemassage;
};