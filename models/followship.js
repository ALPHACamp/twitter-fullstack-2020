'use strict'
const model = (sequelize, DataTypes) => {
  const Followship = sequelize.define(
    'Followship',
    {
      FollowerId: DataTypes.INTEGER,
      FollowingId: DataTypes.INTEGER
    }
  )

  return Followship
}

module.exports = model
