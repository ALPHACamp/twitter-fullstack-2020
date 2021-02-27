module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId : DataTypes.INTEGER,
    followingId: DataTypes.INTEGER,
    createdAt  : DataTypes.DATE,
    updatedAt  : DataTypes.DATE,
  }, {});
  Followship.associate = function (models) {
  };
  return Followship;
};
