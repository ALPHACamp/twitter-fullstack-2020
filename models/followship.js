'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {

    }
  };
  Followship.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}