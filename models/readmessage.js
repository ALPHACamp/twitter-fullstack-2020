module.exports = (sequelize, DataTypes) => {
  const ReadMessage = sequelize.define('ReadMessage', {
    id: {
      allowNull    : false,
      autoIncrement: true,
      primaryKey   : true,
      type         : DataTypes.INTEGER,
    },
    userId   : DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
  }, {});
  ReadMessage.associate = function (models) {
    // associations can be defined here
    ReadMessage.belongsTo(models.User);
    ReadMessage.belongsTo(models.Message);
  };
  return ReadMessage;
};
