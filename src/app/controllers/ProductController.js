const { Product, Bid } = require("../models");

class ProductController {
  async index(req, res) {
    const products = await Product.findAll();

    return res.status(200).json(products);
  }

  async store(req, res) {
    const { name, description, buyOut, lowerBid } = req.body;

    if(!name || !description || !buyOut || !lowerBid) {
      return res.status(500).json("Produto não encontrado");
    }

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

    return res.status(200).json(nextProduct);
  }
}

module.exports = new ProductController();
