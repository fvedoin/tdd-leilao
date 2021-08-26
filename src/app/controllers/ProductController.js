const { Product, Bid } = require("../models");

class ProductController {
  async index(req, res) {
    const products = await Product.findAll();

    return res.status(200).json(products);
  }

  async store(req, res) {
    const { name, description, buyOut, lowerBid } = req.body;

    const product = { name, description, buyOut, lowerBid };

    const inserted = await Product.create(product);

    return res.status(201).json(inserted);
  }

  async getNext(req, res){
    const nextProduct = await Product.findOne({ 
      order: [
          ['order', 'ASC'],
      ]
    });

    const currentBid = await Bid.findOne({
      where: {order: nextProduct.dataValues.order},
      order: [
        ['created_at', 'DESC'],
    ]
    });

    return res.status(200).json({nextProduct, currentBid});
  }
}

module.exports = new ProductController();
