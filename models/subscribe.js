'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscribe = sequelize.define('Subscribe', {
    InfluencerId: DataTypes.INTEGER,
    fansId: DataTypes.INTEGER
  }, {});
  Subscribe.associate = function(models) {
    Subscribe.belongsTo(models.User, { foreignKey: 'InfluencerId', as: 'fansLinks' });
    Subscribe.belongsTo(models.User, { foreignKey: 'fansId', as: 'InfluenceLinks' });
  };
  return Subscribe;
};