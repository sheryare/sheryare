import express from "express";
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetailsById,
  disableProduct,
  getProductStatus,
  getProductTypes,
  addStock,
  getAllProductsFE,
} = require("../controllers/product.controller");
const router = express.Router();

router.route("/products/all").get(getAllProducts);
router.route("/product/new").post(createProduct);

router.route("/products-pagination/all").get(getAllProductsFE);

router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProductDetailsById);
//router.route("/product-by-slug/:slug").get(getProductDetailsBySlug);
router.route("/product/disable/:id").put(disableProduct);
router.route("/products/status").get(getProductStatus);
router.route("/products/types").get(getProductTypes);
router.route("/product/add-stock/:id").put(addStock);

export default router;
