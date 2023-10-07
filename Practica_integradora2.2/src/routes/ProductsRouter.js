import BaseRouter from "./BaseRouter.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
import __dirname from "../utils.js";

const productService = new ProductManager();

class ProductRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      const products = await productService.paginateProducts(
        {},
        { page: 1, limit: 5 }
      );
      res.send({ status: "success", payload: products });
    });

    this.get("/:pid", ["PUBLIC"], async (req, res) => {
      const id = parseInt(req.params.pid);
      const product = await productService.getProductsById(id);
      if (product === "Not Found") {
        res.status(400).json({ message: "Producto no encontrado" });
      } else if (product) {
        res.status(200).json(product);
      } else {
        res.status(400).json({ message: "Producto no encontrado" });
      }
    });

    this.post("/", ["ADMIN"], async (req, res) => {
      try {
        const product = await productService.addProduct(req.body);
        if (product === "The insert code already exists") {
          res
            .status(400)
            .json({ message: "Error al crear el producto", product });
        } else if (product === "Complete all fields") {
          res
            .status(400)
            .json({ message: "Error al crear el producto", product });
        } else {
          res.status(201).json({ message: "Producto creado", product });
        }
      } catch (error) {
        throw new error("Error al crear el producto", error);
      }
    });
    this.put("/:pid", ["ADMIN"], async (req, res) => {
      const id = parseInt(req.params.pid);
      const product = await productService.updateProduct(id, req.body);
      if (product) {
        res.status(200).json({ message: "Producto actualizado", product });
      } else {
        res.status(400).json({ message: "Error al actualizar el producto" });
      }
    });

    this.delete("/:pid", ["ADMIN"], async (req, res) => {
      const id = parseInt(req.params.pid);
      const product = await productService.deleteProduct(id);
      if (product === `Can't find product with id : ${id}`) {
        res
          .status(400)
          .json({ message: "Error al eliminar el producto", product });
      } else if (product) {
        res.status(200).json({ message: "Producto eliminado", product });
      } else {
        res.status(400).json({ message: "Error al eliminar el producto" });
      }
    });
  }
}

const productRouter = new ProductRouter();
export default productRouter.getRouter();
