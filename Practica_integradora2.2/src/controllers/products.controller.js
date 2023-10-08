import { productsService } from "../services/index.js";

const paginateProducts = async (req, res) => {
  const products = await productsService.paginateProducts(
    {},
    { page: 1, limit: 5 }
  );
  res.send({ status: "success", payload: products });
};
const getProductBy = async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await productsService.getProductsById(id);
  if (product === "Not Found") {
    res.status(400).json({ message: "Producto no encontrado" });
  } else if (product) {
    res.status(200).json(product);
  } else {
    res.status(400).json({ message: "Producto no encontrado" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productsService.createProduct(req.body);
    if (product === "The insert code already exists") {
      res.status(400).json({ message: "Error al crear el producto", product });
    } else if (product === "Complete all fields") {
      res.status(400).json({ message: "Error al crear el producto", product });
    } else {
      res.status(201).json({ message: "Producto creado", product });
    }
  } catch (error) {
    throw new error("Error al crear el producto", error);
  }
};
const updateProduct = async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await productsService.updateProduct(id, req.body);
  if (product) {
    res.status(200).json({ message: "Producto actualizado", product });
  } else {
    res.status(400).json({ message: "Error al actualizar el producto" });
  }
};
const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await productsService.deleteProduct(id);
  if (product === `Can't find product with id : ${id}`) {
    res.status(400).json({ message: "Error al eliminar el producto", product });
  } else if (product) {
    res.status(200).json({ message: "Producto eliminado", product });
  } else {
    res.status(400).json({ message: "Error al eliminar el producto" });
  }
};

export default {
  getProducts,
  getProductBy,
  paginateProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
