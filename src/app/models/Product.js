module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      order: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      lowerBid: DataTypes.FLOAT,
      buyOut: DataTypes.FLOAT,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    }
  );

  return Product;
};
