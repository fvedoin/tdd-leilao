const faker = require("faker");
const { factory } = require("factory-girl");
const { Product } = require("../src/app/models");

factory.define("Product", Product, {
  name: faker.name.findName(),
  description: faker.lorem.paragraph(),
  lowerBid: faker.finance.amount(100, 1000),
  buyOut: faker.finance.amount(1500)
});

module.exports = factory;
