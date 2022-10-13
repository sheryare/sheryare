import express from "express";
const {
  getProductCategoryBySlug,
} = require("../controllers/productcategory.controller");
const router = express.Router();

router.route("/product-by-category-slug/:slug").get(getProductCategoryBySlug);
export default router;
