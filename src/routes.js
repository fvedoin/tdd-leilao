const routes = require("express").Router();

const ProductController = require("./app/controllers/ProductController");

routes.get("/next-product", ProductController.getNext);
routes.post("/products", ProductController.store);

routes.get("/dashboard", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
