const Product = require("./Product");

module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define(
    "Bid",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bid: DataTypes.FLOAT
    }
  );

  return Bid;
};
