export default class ProductsService {
  constructor(manager) {
    this.manager = manager;
  }
  getProducts = () => {
    return this.manager.getProducts(params);
  };
  paginateProducts = () => {
    return this.manager.paginateProducts(params, paginateOptions);
  };
  getProductBy = () => {
    return this.manager.getProductBy(params);
  };
  createProduct = () => {
    return this.manager.createProduct(product);
  };
  updateProduct = () => {
    return this.manager.updateProduct(id, product);
  };
  deleteProduct = () => {
    return this.manager.deleteProduct(id);
  };
}
