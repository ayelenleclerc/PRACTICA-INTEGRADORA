import BaseRouter from "./BaseRouter.js";
import __dirname from "../utils.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";

const cartServices = new CartManager();
const productServices = new ProductManager();

class CartRouter extends BaseRouter {
  init() {
    this.get("/:cid", ["USER"], async (req, res) => {
      const { cid } = req.params;
      const cart = await cartServices.findOne({ _id: cid });
      if (!cart)
        return res
          .status(404)
          .send({ status: "error", message: "Cart not found" });
      res.send({ status: "success", payload: cart });
    });

    this.post("/", ["ADMIN"], async (req, res) => {
      const result = await cartServices.createCart();
      res.send({ status: "success", payload: result._id });
    });

    this.put(":cid/products/:pid", ["NO_AUTH"], async (req, res) => {
      const { cid, pid } = req.params;
      const cart = await cartServices.findOne({ _id: cid });
      if (!cart)
        return res
          .status(400)
          .send({ status: "error", message: "Cart not found" });
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
      await cartServices.updateCart(cid, {
        products: cart.products,
        quantity: cart.quantity,
      });
      res.send({ status: "success", payload: cart });
    });

    this.put("/products/:pid", ["USER"], async (req, res) => {
      const { pid } = req.params;
      const cart = await cartServices.getCartById({ _id: req.user.cart });
      if (!cart)
        return res
          .status(400)
          .send({ status: "error", message: "Cart not found" });
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
      await cartServices.updateCart(cart._id, {
        products: cart.products,
        quantity: cart.quantity,
      });

      await cartServices.updateCart(req.user.cart, {
        products: cart.products,
        quantity: cart.quantity,
      });
      res.send({ status: "success", payload: cart });
    });
  }
}

const cartsRouter = new CartRouter();

export default cartsRouter.getRouter();
