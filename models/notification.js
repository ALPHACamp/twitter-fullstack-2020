module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type     : DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type     : DataTypes.DATE,
    },
  }, {});
  Notification.associate = function (models) {
    Notification.belongsTo(models.User);
  };
  return Notification;
};
