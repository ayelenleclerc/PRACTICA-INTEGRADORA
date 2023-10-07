import CartManager from "../dao/mongo/managers/cartManager.js";

const cartService = new CartManager();

const cartSetter = async (req, res, next) => {
  // if(req.user&&req.cokkies.cart){ //OPCIONAL
  //res.clearCookie("cart");
  // return next();
  // }

  if (!req.cookies.cart && !req.user) {
    const cart = await cartService.createCart();
    res.cookie("cart", cart._id.toString());
  }
  next();
};

export default cartSetter;
