import BaseRouter from "./BaseRouter.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
import { getValidFilters } from "../utils.js";

const productService = new ProductManager();

class ViewsRouter extends BaseRouter {
  init() {
    this.get("/register", ["NO_AUTH"], async (req, res) => {
      res.render("register");
    });

    this.get("/login", ["NO_AUTH"], async (req, res) => {
      res.render("login");
    });

    this.get("/profile", ["AUTH"], async (req, res) => {
      res.render("profile");
    });
    this.get("/", ["PUBLIC"], async (req, res) => {
      res.render("home");
    });

    this.get("/products", ["PUBLIC"], async (req, res) => {
      let { page = 1, limit = 5, sort, order = 1, ...filters } = req.query;
      const cleanFilters = getValidFilters(filters, "product");
      console.log(cleanFilters);
      let sortResult = {};
      if (sort) {
        sortResult[sort] = order;
      }
      const pagination = await productService.paginateProducts(cleanFilters, {
        page,
        lean: true,
        limit,
        sort: sortResult,
      });
      console.log(pagination);
      res.render("productos", {
        products: pagination.docs,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        page: pagination.page,
      });
    });

    this.get("/realTimeProducts", ["ADMIN"], async (req, res) => {
      const listaProductos = await productService.getProducts();
      res.render("realTimeProducts", { listaProductos });
    });
    this.get("/chat", ["PUBLIC"], (req, res) => {
      res.render("chat");
    });
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();
