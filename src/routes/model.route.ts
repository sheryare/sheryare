import express from "express";
const {
  createModel,
  getAllModels,
  updateModel,
  deleteModel,
  getSingleModelBySlug,
  getSingleModelById,
  getAllModelsByBrandId,
} = require("../controllers/model.controller");
const router = express.Router();

router.route("/model/new").post(createModel);
router.route("/model/all").get(getAllModels);
router.route("/model/:id").put(updateModel).delete(deleteModel);
router.route("/model-by-slug/:slug").get(getSingleModelBySlug);
router.route("/model-by-id/:id").get(getSingleModelById);
router.route("/models-by-brandid/:id").get(getAllModelsByBrandId);

export default router;
