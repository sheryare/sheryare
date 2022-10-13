import express from "express";
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  disableCategory,
  getSingleCategoryById,
  getSingleCategoryBySlug,
  getSubCategoriesBySlug,
  getSubCategoriesById,
} = require("../controllers/category.controller");
const router = express.Router();

router.route("/category/new").post(createCategory);
router.route("/category/all").get(getAllCategories);

router.route("/category/:id").put(updateCategory).delete(deleteCategory);
router.route("/category/disable/:id").put(disableCategory);
router.route("/single-category/:id").get(getSingleCategoryById);
router.route("/category-by-slug/:slug").get(getSingleCategoryBySlug);
router.route("/subcategories-by-slug/:slug").get(getSubCategoriesBySlug);
router.route("/subcategories-by-id/:id").get(getSubCategoriesById);

export default router;
