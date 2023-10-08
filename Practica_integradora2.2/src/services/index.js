import CartsService from "./CartsService.js";
import ProductsService from "./ProductsService.js";
import UsersService from "./UsersService.js";

import CartManager from "../dao/mongo/managers/cartManager.js";
import ProductManager from "../dao/mongo/managers/productManager.js";
import UserManager from "../dao/mongo/managers/userManager.js";

export const cartsService = new CartsService(new CartManager());
export const productsService = new ProductsService(new ProductManager());
export const usersService = new UsersService(new UserManager());
