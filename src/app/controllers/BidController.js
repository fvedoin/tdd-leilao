const { Product, Bid } = require("../models");

class BidController {
  async index(req, res) {
    const products = await Product.findAll();

    return res.status(200).json(products);
  }

  async store(req, res) {
    const { productOrder, bid } = req.body;

    const product = await Product.findOne({ 
      where: {order: productOrder}
    });

    const inserted = await Product.create(product);

    return res.status(201).json(inserted);
  }

}

module.exports = new BidController();
