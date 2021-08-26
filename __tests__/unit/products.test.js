const { Product } = require("../../src/app/models");
const truncate = require("../utils/truncate");

describe("Product", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should store a new product", async () => {
    const product = await Product.create({
      name: "Monalisa",
      description: "Tinta na tela",
      lowerBid: 1000.00,
      buyOut: 2998.99
    });

    const count = await Product.count({});
    
    expect(count).toBe(1);
  });
});
