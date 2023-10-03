import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";

const cartServices = new CartManager();
const productServices = new ProductManager();

const router = Router();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartServices.findOne({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", message: "Cart not found" });
  res.send({ status: "success", payload: cart });
});

router.post("/", async (req, res) => {
  const result = await cartServices.createCart();
  res.send({ status: "success", payload: result._id });
});

router.put(":cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartServices.findOne({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "Cart not found" });
  const product = await productServices.getProductBy({ _id: pid });
  if (!product)
    return res
      .status(400)
      .send({ status: "error", message: "Product not found" });
  const productExistInCart = cart.products.find((item) => {
    return item.product.toString() === pid;
  });
  if (productExistInCart)
    return res
      .status(400)
      .send({ status: "error", message: "Product already in cart" });
  cart.products.push({ product: pid, quantity: +1 });
  await cartServices.updateCart(cid, cart);
  res.send({ status: "success", payload: cart });
});

export default router;
