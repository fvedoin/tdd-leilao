const routes = require("express").Router();

const ProductController = require("./app/controllers/ProductController");
const BidController = require("./app/controllers/BidController");

routes.get("/next-product", ProductController.getNext);
routes.post("/products", ProductController.store);

routes.put("/products/:order/newBid", BidController.newBid);
routes.post("/finish", BidController.finish);

routes.get("/dashboard", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
