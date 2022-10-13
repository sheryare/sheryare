import { Response } from "express";
import { Product } from "../models/product.model";
import { ErrorHandler } from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { Category } from "../models/category.model";
import ecommerceDb from "../config/ecommerceDb";
import { In, Like } from "typeorm";
const ProductRepository = ecommerceDb.getRepository(Product);

// Get product by category slug
exports.getProductCategoryBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const slug = req.params.slug;
  const checkCategorySlug = await Category.findOne({
    where: { slug: slug },
  });
  if (!checkCategorySlug) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Category not found",
    });
  }

  const productByCategory = await ProductRepository.find({
    where: { defaultCategoryId: Like("%" + checkCategorySlug.id + "%") },
  });

  if (productByCategory.length == 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Products for this category not found",
    });
  }
  return res.status(200).json({
    success: true,
    productByCategory,
  });
});
