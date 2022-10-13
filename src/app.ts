const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
import errorMiddleware from "./middleware/error";
import product from "./routes/product.route";
import category from "./routes/category.route";
import productToCategory from "./routes/productcategory.route";
import { authJwt } from "./middleware/authJwt";
import { verifySignUp } from "./middleware/verifySignUp";
import order from "./routes/order.route";
import brand from "./routes/brand.route";
import tag from "./routes/tag.route";
import model from "./routes/model.route";

const cors = require("cors");

// Config
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use();
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  product
);
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  category
);
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  productToCategory
);
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  order
);
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  brand
);
app.use("/admin", [verifySignUp.checkisValidClient, authJwt.verifyToken], tag);
app.use(
  "/admin",
  [verifySignUp.checkisValidClient, authJwt.verifyToken],
  model
);

// Middleware for Errors
app.use(errorMiddleware);

export default app;
