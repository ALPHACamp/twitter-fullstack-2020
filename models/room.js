'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    userId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
    Room.hasMany(models.Message)
    Room.belongsTo(models.User)
  };
  return Room;
};