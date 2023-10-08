import { cartsService, productsService } from "../services/index.js";

const getCarts = async (req, res) => {};

const getCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsService.findOne({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", message: "Cart not found" });
  res.send({ status: "success", payload: cart });
};
const createCart = async (req, res) => {
  const result = await cartsService.createCart();
  res.send({ status: "success", payload: result._id });
};
const updateCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartsService.findOne({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "Cart not found" });
  const product = await productsService.getProductBy({ _id: pid });
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
  await cartsService.updateCart(cid, {
    products: cart.products,
    quantity: cart.quantity,
  });
  res.send({ status: "success", payload: cart });
};
const deleteCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartsService.findOne({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "Cart not found" });
  await cartsService.deleteCart(cid);
  res.send({ status: "success", message: "Cart deleted successfully" });
};

export default {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
