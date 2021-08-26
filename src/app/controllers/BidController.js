const sequelize = require('sequelize');
const { Product, SoldProduct } = require("../models");

class BidController {
  async index(req, res) {
    const products = await Product.findAll();

    return res.status(200).json(products);
  }

  async finish(req, res) {
    const { order } = req.body;

    try {
      const product = await Product.findOne({ 
        where: {order: order}
      });

      if(product){
        await SoldProduct.create({
          order: product.dataValues.order,
          lowerBid: product.dataValues.lowerBid,
          buyOut: product.dataValues.buyOut,
          bid: product.dataValues.bid,
          name: product.dataValues.name,
          description: product.dataValues.description
        });
        await product.destroy();
        return res.status(201).send();
      }
      
    }catch(e){
      return res.status(500).send();
    }
  }

  async newBid(req, res){
    const { bid } = req.body;
    const { order } = req.params;

    const product = await Product.findOne({
      where: {
        order: order
      }
    })

    if(product.dataValues.lowerBid > bid){
      return res.status(500).json("O lance deve ser maior que " + product.dataValues.lowerBid);
    }

    await Product.update({ bid: bid }, {
      where: {
        order: order
      }
    });

    return res.status(201).send();
  }
}

module.exports = new BidController();
