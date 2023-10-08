import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";

class ProductRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], productsController.paginateProducts);

    this.get("/:pid", ["PUBLIC"], productsController.getProductBy);

    this.post("/", ["ADMIN"], productsController.createProduct);

    this.put("/:pid", ["ADMIN"], productsController.updateProduct);

    this.delete("/:pid", ["ADMIN"], productsController.deleteProduct);
  }
}

const productRouter = new ProductRouter();
export default productRouter.getRouter();
