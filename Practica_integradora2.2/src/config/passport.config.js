import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import UsersManager from "../dao/mongo/managers/userManager.js";
import CartManager from "../dao/mongo/managers/cartManager.js";
import authService from "../services/authService.js";
import config from "./config.js";

const usersService = new UsersManager();
const cartSevice = new CartManager();

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName } = req.body;
          if (!firstName || !lastName)
            return done(null, false, { message: "Incomplete values" });
          //Corroborar que el usuario no exista.
          const exists = await usersService.getUserBy({ email });
          if (exists)
            return done(null, false, { message: "User already exists" });
          //Antes de crear al usuario, necesito aplicar un hash a su contraseña
          const hashedPassword = await authService.createHash(password);
          //Ahora sí creo al usuario
          const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
          };

          //Revisar el carrito temporal
          let cart;
          if (req.cookies["cart"]) {
            //Obtener el que ya esta en la cookie
            cart = req.cookies["cart"];
          } else {
            cartResult = await cartSevice.createCart();
            cart = cartResult.id;
          }
          newUser.cart = cart;

          const result = await usersService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          if (
            email === config.app.ADMIN_EMAIL &&
            password === config.app.ADMIN_PASSWORD
          ) {
            const adminUser = {
              role: "admin",
              id: "0",
              firstName: "admin",
            };
            return done(null, adminUser);
          }
          //Aquí el usuario sí debería existir, corroborar primero.
          const user = await usersService.getUserBy({ email });
          if (!user)
            return done(null, false, { message: "Invalid Credentials" });
          //Ahora toca validar su contraseña, ¿es equivalente?
          const isValidPassword = await authService.validatePassword(
            password,
            user.password
          );
          if (!isValidPassword)
            return done(null, false, { message: "Invalid Credentials" });
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          authService.extractAuthToken,
        ]),
        secretOrKey: "jwtSecret",
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );
};

export default initializePassportStrategies;
