'use strict';
module.exports = (sequelize, DataTypes) => {
  const Public = sequelize.define(
    'Public',
    {
      User_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
    },
    {},
  );
  Public.associate = function (models) {
    Public.belongsTo(models.User);
    // associations can be defined here
  };
  return Public;
};
