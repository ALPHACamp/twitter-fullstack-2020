'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
<<<<<<< HEAD
      Like.belongsTo(models.User)
      Like.belongsTo(models.Tweet)

=======
      // define association here
      Like.belongsTo(models.User)
      Like.belongsTo(models.Tweet)
>>>>>>> 5141afd608b271e9e6f3aacd20df0db52b15f879
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  },
    {
      sequelize,
      modelName: 'Like',
    });
  return Like;
};