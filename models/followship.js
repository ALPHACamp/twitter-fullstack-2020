'use strict'
// Use extending model instead of sequelize.define to define model
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
    }
  }
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    // underscored: true
  })
  return Followship
}
