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
  it("should not insert a bid with value < product lower bid", async () => {
    const p1 = await factory.create("Product");

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: p1.lowerBid-100
      });

    expect(response.body).toBe("O lance deve ser maior que " + p1.lowerBid);
  });

  //SE O LANCE FOR MAIOR QUE O VALOR DO BUY OUT, NÃO INSERE O LANCE
  it("should not insert a bid with value > product buy out", async () => {
    const p1 = await factory.create("Product");

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: p1.buyOut+100
      });

    expect(response.body).toBe("Este lance é maior que o valor de buy out do produto");
  });

  //SE O LANCE FOR MENOR QUE OUTRO LANCE DADO, NÃO INSERE O LANCE
  it("should not insert a bid with value < product previous bid", async () => {
    const p1 = await factory.create("Product", {bid: 1300});

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: 1200
      });

    expect(response.body).toBe("O produto já possui um lance maior que este");
  });

  //UM PRODUTO PODE QUE JÁ FOI LEILOADO NÃO PODE RECEBER MAIS LANCES
  it("this should not allow bids on products that have already been auctioned", async () => {
    const p1 = await factory.create("Product");

    await request(app)
      .post("/finish")
      .send({
        order: p1.order,
      });

    const response2 = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: 1200
      });
    
    expect(response2.body).toBe("Este produto já foi leiloado e não aceita mais lances");
  });

  //SE O LANCE FOR IGUAL AO BUY OUT, O LEILÃO DEVE SER ENCERRADO
  it("this should insert the bid and finish the bid auction", async () => {
    const p1 = await factory.create("Product");

    const response = await request(app)
      .put(`/products/${p1.order}/newBid`)
      .send({
        order: p1.order,
        bid: p1.buyOut
      });
    
    expect(response.status).toBe(201);
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

  //NÃO PERMITE FINALIZAR O LEILÃO DE UM PRODUTO QUE JÁ FOI LEILOADO
  it("should not finish an already finished bid auction", async () => {
    const p1 = await factory.create("Product");

    const response1 = await request(app)
      .post("/finish")
      .send({
        order: p1.order,
      });

    const response2 = await request(app)
      .post("/finish")
      .send({
        order: p1.order,
      });

    expect(response2.body).toBe("Este produto já foi leiloado");
  });
});