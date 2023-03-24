'use strict';
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Public extends Model {
    static associate(models) {
      Public.belongsTo(models.User);
    };
  };
  Public.init({
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING,
  },
    {
      sequelize,
      modelName: 'Public',
      tableName: 'Publics',
      underscored: true
    },
  );
  return Public;
};
