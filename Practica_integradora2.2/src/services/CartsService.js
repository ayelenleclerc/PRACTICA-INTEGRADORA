export default class CartsService {
  constructor(manager) {
    this.manager = manager;
  }
  getCart = () => {
    return this.manager.getCart(params);
  };

  getCartById = () => {
    return this.manager.getCartById(params, (options = {}));
  };
  createCart = () => {
    return this.manager.createCart();
  };
  updateCart = () => {
    return this.manager.updateCart(id, cart);
  };
  deleteCart = () => {
    return this.manager.deleteCart(id);
  };
}
