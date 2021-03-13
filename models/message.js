module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    senderId: {
      allowNull: false,
      type     : DataTypes.INTEGER,
    },
    receiverId: {
      allowNull: true,
      type     : DataTypes.INTEGER,
    },
    message: {
      allowNull: false,
      type     : DataTypes.TEXT,
    },
    isPublic: {
      defaultValue: false,
      type        : DataTypes.BOOLEAN,
    },
    isRead: {
      defaultValue: false,
      type        : DataTypes.BOOLEAN,
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
  Message.associate = function (models) {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as        : 'Sender',
    });
    Message.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as        : 'Receiver',
    });
  };
  return Message;
};
