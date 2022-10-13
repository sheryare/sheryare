import express from "express";
const {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
  getSingleTagBySlug,
  getSingleTagById,
} = require("../controllers/tags.controller");
const router = express.Router();

router.route("/tag/new").post(createTag);
router.route("/tag/all").get(getAllTags);
router.route("/tag/:id").put(updateTag).delete(deleteTag);
router.route("/tag-by-slug/:slug").get(getSingleTagBySlug);
router.route("/tag-by-id/:id").get(getSingleTagById);

export default router;
