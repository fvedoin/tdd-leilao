const request = require("supertest");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("Products", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should insert a valid product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: 'O Grito',
        description: 'Tinta guache',
        buyOut: 2000.00,
        lowerBid: 500,
        bid: null
      });

    expect(response.status).toBe(201);
  });

  it("should show the next product", async () => {
    const p1 = await factory.create("Product");
    const p2 = await factory.create("Product");
    const p3 = await factory.create("Product");
    const b1 = await factory.create("Bid", {
      order: p1.order,
      bid: p1.buyOut - 100
    });
    
    const b2 = await factory.create("Bid", {
      order: p1.order,
      bid: p1.buyOut - 50
    });

    const response = await request(app)
      .get("/next-product");
    
    expect(response.body.nextProduct.order).toBe(p1.order);
  });

  it("should return the last inserted bid", async () => {
    const p1 = await factory.create("Product");
    const p2 = await factory.create("Product");
    const p3 = await factory.create("Product");
    const b1 = await factory.create("Bid", {
      order: p1.order,
      bid: p1.buyOut - 100
    });
    
    const b2 = await factory.create("Bid", {
      order: p1.order,
      bid: p1.buyOut - 50
    });

    const response = await request(app)
      .get("/next-product");
    
    expect(response.body.currentBid.id).toBe(b2.id);
  });
});