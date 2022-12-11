'use strict'
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    name: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN
  }, {
    underscored: true,
  })
  Todo.associate = function (models) {
    // associations can be defined here
  }
  return Todo
}
