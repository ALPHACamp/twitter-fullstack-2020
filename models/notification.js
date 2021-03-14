module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    userId: DataTypes.INTEGER,
    type  : DataTypes.TEXT,
    data  : DataTypes.VARCHAR,
  }, {});
  Notification.associate = function (models) {
    // associations can be defined here
  };
  return Notify;
};
