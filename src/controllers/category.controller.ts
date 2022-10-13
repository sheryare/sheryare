import { Like, Not } from "typeorm";
import { Request, Response } from "express";
import { Category } from "../models/category.model";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";

import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { ProductCategory } from "../models/productcategory.model";
import slugify from "slugify";
const CategoryRepository = myDataSource.getRepository(Category);
const ProductCategoryRepository = myDataSource.getRepository(ProductCategory);
exports.createCategory = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body, token } = req;
  if (body.categorykey !== null) {
    const checkDuplicate = await CategoryRepository.findOne({
      where: {
        categorykey: body.categorykey,
        clientguid: client.guid,
        status: 1,
      },
    });
    if (checkDuplicate) {
      return res.status(422).json({
        success: true,
        data: [],
        message: "Category Key  already exists",
      });
    }
  }
  let slug = slugify(body.title, {
    lower: true,
  });

  let checkDuplicate = await CategoryRepository.find({
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

  const category = await Category.create({
    ...body,
    status: 1,
    clientguid: client.clientguid,
    createBy: token.guid,
    categorykey: body.categorykey,
    isSpecial: body.isSpecial,
    slug: slug,
    featuredImage: body.featuredImage,
  });
  const response = await Category.save(category);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Category created successfully",
  });
});
// Update Category
exports.updateCategory = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(
      new ErrorHandler("Category id cannot be null or undefined", 400)
    );
  }

  const category = await CategoryRepository.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }
  if (body.categorykey !== null) {
    const checkDuplicate = await CategoryRepository.findOne({
      where: {
        id: Not(id),
        categorykey: body.categorykey,
        clientguid: client.clientguid,
      },
    });
    if (checkDuplicate) {
      return res.status(422).json({
        success: true,
        data: [],
        message: "Category Key  already exists",
      });
    }
  }

  const updateCategory = {
    ...body,
    updateBy: token.guid,
  };
  const mergedCategory = await Category.merge(category, updateCategory);

  const response = await Category.save(mergedCategory);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Category Updated successfully",
  });
});
// Delete Category
exports.deleteCategory = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(
      new ErrorHandler("Category id cannot be null or undefined", 400)
    );
  }
  const category = await Category.findOne({
    where: { id: id, clientguid: client.clientguid },
  });

  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }
  category.deleteBy = token.guid;
  await category.save();

  await CategoryRepository.softRemove(category);

  return res.status(200).json({
    success: true,
    message: "Category has been deleted successfully",
  });
});
// Disable Category
exports.disableCategory = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(
      new ErrorHandler("Category id cannot be null or undefined", 400)
    );
  }
  const category = await Category.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }
  category.status = 0;
  await Category.save(category);
  return res.status(200).json({
    success: true,
    message: "Category disabled successfully",
  });
});
// Get All Categories
exports.getAllCategories = catchAsyncErrors(async function (
  req: any,
  res: Response
) {
  const { client } = req;
  const categories = await CategoryRepository.find({
    where: { clientguid: client.clientguid, status: 1 },
  });
  if (!categories) {
    res.status(200).json({
      success: true,
      data: [],
      message: "Categories not found",
    });
  }
  res.status(200).json({
    success: true,
    data: categories,
  });
});
// Get Category Details by id
exports.getSingleCategoryById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(
      new ErrorHandler("Category id cannot be null or undefined", 400)
    );
  }
  const category = await Category.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: category,
  });
});
// Get single category by slug
exports.getSingleCategoryBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const slug = req.params.slug;
  const category = await Category.findOne({
    where: { slug: slug, clientguid: client.clientguid },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: category,
  });
});
exports.getSubCategoriesBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const slug = req.params.slug;
  const category = await Category.findOne({
    where: { slug: slug, clientguid: client.clientguid, status: 1 },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }
  const subCategoires = await CategoryRepository.find({
    where: {
      upperCategory: category.id,
      clientguid: client.clientguid,
      status: 1,
    },
  });
  return res.status(200).json({
    success: true,
    subCategoires,
  });
});
exports.getSubCategoriesById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);
  const category = await CategoryRepository.findOne({
    where: { id: id, clientguid: client.clientguid, status: 1 },
  });
  if (!category) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }
  const subCategoires = await CategoryRepository.find({
    where: {
      upperCategory: category.id,
      clientguid: client.clientguid,
      status: 1,
    },
  });
  return res.status(200).json({
    success: true,
    subCategoires,
  });
});
