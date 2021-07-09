'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.Comment)
      Post.hasMany(models.Like)
    }
  };
  Post.init({
    UserId:DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    moderated:DataTypes.BOOLEAN,
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};