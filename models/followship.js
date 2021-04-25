'use strict'
const model = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    }
  )
  Followship.associate = function (models) {
  }

  return Followship
}

module.exports = model
