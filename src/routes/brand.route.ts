import express from "express";
const {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getSingleBrandBySlug,
  getSingleBrandById,
} = require("../controllers/brand.controller");
const router = express.Router();

router.route("/brand/new").post(createBrand);
router.route("/brand/all").get(getAllBrands);
router.route("/brand/:id").put(updateBrand).delete(deleteBrand);
router.route("/brand-by-slug/:slug").get(getSingleBrandBySlug);
router.route("/brand-by-id/:id").get(getSingleBrandById);

export default router;
