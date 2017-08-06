module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("gallery", {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING


  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Gallery;
};