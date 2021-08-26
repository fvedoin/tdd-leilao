const request = require("supertest");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("Products", () => {
  beforeEach(async () => {
    await truncate();
  });

  //INSERE UM NOVO PRODUTO
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

  //BUSCA O PRÓXIMO PRODUTO A SER LEILOADO (PRIMEIRO A SER INSERIDO)
  it("should show the next product", async () => {
    const p1 = await factory.create("Product");
    const p2 = await factory.create("Product");
    const p3 = await factory.create("Product");

    const response = await request(app)
      .get("/next-product");
    
    expect(response.body.order).toBe(p1.order);
  });

  //INSERE UM LANCE COM SUCESSO
  it("should insert a bid", async () => {
    const p1 = await factory.create("Product");

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.buyOut-100,
      });

    expect(response.status).toBe(201);
  });

  //SE O LANCE FOR MENOR QUE O LANCE MÍNIMO, NÃO INSERE O LANCE
  it("should not insert a bid with bid < product lower bid", async () => {
    const p1 = await factory.create("Product");

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: p1.lowerBid-100
      });

    expect(response.body).toBe("O lance deve ser maior que " + p1.lowerBid);
  });

  //SE O LANCE FOR MENOR QUE OUTRO LANCE DADO, NÃO INSERE O LANCE
  it("should not insert a bid with bid < product previous bid", async () => {
    const p1 = await factory.create("Product", {bid: 1300});

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: 1200
      });

    expect(response.body).toBe("O produto já possui um lance maior que este");
  });

  //FINALIZA UM LEILÃO COM SUCESSO
  it("should finish the bid auction", async () => {
    const p1 = await factory.create("Product");
    const p2 = await factory.create("Product");

    const response = await request(app)
      .post("/finish")
      .send({
        order: p1.order,
      });

    expect(response.status).toBe(201);
  });
});