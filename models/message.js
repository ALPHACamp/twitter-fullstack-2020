'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    beenSeen: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {

    modelName: 'Message',
    tableName: 'Messages',
    sequelize
  })
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' })
    Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' })
  }
  return Message
}
