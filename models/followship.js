'use strict'
const { DataTypes, Model } = require('sequelize')

module.exports = sequelize => {
  class Followship extends Model {
    static associate(models) {}
  }
  Followship.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Followship',
      tableName: 'Followships',
      underscored: true
    }
  )
  return Followship
}
