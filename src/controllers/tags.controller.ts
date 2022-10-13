import { Like, Not } from "typeorm";
import { Request, Response } from "express";
import { Category } from "../models/category.model";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";

import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { ProductCategory } from "../models/productcategory.model";
import slugify from "slugify";
import { Tags } from "../models/tags.model";
import { Product } from "src/models/product.model";
const TagsRepository = myDataSource.getRepository(Tags);
// Create Tag
exports.createTag = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body, token } = req;

  let slug = slugify(body.title, {
    lower: true,
  });

  let checkDuplicate = await TagsRepository.find({
    where: {
      slug: Like("%" + slug + "%"),
      status: 1,
      clientguid: client.clientguid,
    },
  });
  if (checkDuplicate) {
    let checkDuplicateTemp = checkDuplicate
      .map((el: any) => {
        let slugExtra = el.slug.replace(slug, "").replace("-", "");
        slugExtra = slugExtra != "" ? parseInt(slugExtra) : 0;
        return slugExtra;
      })
      .sort((a: any, b: any) => b - a);
    if (checkDuplicateTemp.length > 0) {
      slug = `${slug}-${checkDuplicateTemp[0] + 1}`;
    }
  }

  const tag = await Tags.create({
    ...body,
    status: 1,
    clientguid: client.clientguid,
    createBy: token.guid,
    slug: slug,
  });
  const response = await Tags.save(tag);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Tag has been created successfully",
  });
});
// Update Tag
exports.updateTag = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Tag id cannot be null or undefined", 400));
  }

  const tag = await TagsRepository.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!tag) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Tag not found",
    });
  }

  const updateTag = {
    ...body,
    updateBy: token.guid,
  };
  const mergedTag = await Category.merge(tag, updateTag);

  const response = await Tags.save(mergedTag);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Tag has been Updated successfully",
  });
});
// Delete Tag
exports.deleteTag = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Tag id cannot be null or undefined", 400));
  }
  const tag = await Tags.findOne({
    where: { id: id, clientguid: client.clientguid },
  });

  if (!tag) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Tag not found",
    });
  }
  tag.deleteBy = token.guid;
  await tag.save();

  await TagsRepository.softDelete(id);

  return res.status(200).json({
    success: true,
    message: "Tag has been deleted successfully",
  });
});

// Get All Tags
exports.getAllTags = catchAsyncErrors(async function (req: any, res: Response) {
  const { client } = req;
  const tags = await TagsRepository.find({
    where: { clientguid: client.clientguid, status: 1 },
  });
  if (tags.length == 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Tags not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: tags,
  });
});
// Get Tag Details by id
exports.getSingleTagById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Tag id cannot be null or undefined", 400));
  }
  const tag = await Tags.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!tag) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Tag not found",
    });
  }

  return res.status(200).json({
    success: true,
    tag,
  });
});
// Get single Tag by slug
exports.getSingleTagBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const slug = req.params.slug;
  const tag = await Tags.findOne({
    where: { slug: slug, clientguid: client.clientguid },
  });
  if (!tag) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Tag not found",
    });
  }

  return res.status(200).json({
    success: true,
    tag,
  });
});
