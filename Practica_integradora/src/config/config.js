import dotenv from "dotenv";

dotenv.config();

export default {
  app: {
    PORT: process.env.PORT || 8080,
  },
  mongo: {
    URI: process.env.MONGO_URL || "mongodb://localhost:27017",
  },
  jwt: {
    COOKIE: process.env.JWT_COOKIE,
    SECRET: process.env.JWT_SECRET,
  },
};
