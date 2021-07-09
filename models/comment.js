"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Post);
      Comment.belongsTo(models.User);
      Comment.hasMany(models.Comment);
    }
  }
  Comment.init(
    {
      content: DataTypes.STRING,
      CommentId: DataTypes.NUMBER,
      PostId: DataTypes.NUMBER,
      UserId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
