import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { ProductStatus } from "../models/productstatus.model";
import { ProductType } from "../models/producttype.model";
import { PRODUCT_STATUS } from "../utils/constants";
import { DataSource, In, Like, Not } from "typeorm";
import slugify from "slugify";
import { Category } from "../models/category.model";
import { Tags } from "../models/tags.model";
import { Brands } from "../models/brand.model";
const CategoryRepository = myDataSource.getRepository(Category);
const TagsRepository = myDataSource.getRepository(Tags);
const BrandRepository = myDataSource.getRepository(Brands);

// Create Product -- Admin
const ProductRepository = myDataSource.getRepository(Product);

exports.createProduct = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const checkDuplicateSKU = await ProductRepository.findOne({
    where: {
      sku: body.sku,
      clientguid: client.guid,
    },
  });

  if (checkDuplicateSKU) {
    return res.status(422).json({
      success: true,
      data: [],
      message: "Product SKU  already exists",
    });
  }
  let slug = slugify(body.title, {
    lower: true,
  });

  let checkDuplicate = await ProductRepository.find({
    where: { slug: Like("%" + slug + "%"), clientguid: client.clientguid },
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
  let getCategories;
  if (body.defaultCategoryId.length > 0) {
    getCategories = await CategoryRepository.createQueryBuilder()
      .where({ id: In(body.defaultCategoryId) })
      .getMany();
  }
  let getTags;
  if (body.defaultTagId.length > 0) {
    getTags = await TagsRepository.createQueryBuilder()
      .where({ id: In(body.defaultTagId) })
      .getMany();
  }
  let getBrands;
  if (body.brandId) {
    getBrands = await BrandRepository.createQueryBuilder()
      .where({ id: body.brandId })
      .getOne();
  }
  const product = await Product.create({
    ...body,
    brands: getBrands,
    ProductCategories: getCategories,
    ProductTags: getTags,
    slug: slug,
    clientguid: client.clientguid,
    createBy: token.guid,
  });

  const newProduct = await Product.save(product);

  return res.status(200).json({
    success: true,
    data: newProduct,
    message: "Product was added successfully!",
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  console.log(req.params);

  if (isNaN(req.params.id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await Product.findOne({
    where: { id: parseInt(req.params.id), clientguid: client.clientguid },
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 406));
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

// Get Product Details by ID
exports.getProductDetailsById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  console.log(req.params);

  if (isNaN(req.params.id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await Product.findOne({
    where: { id: parseInt(req.params.id), clientguid: client.clientguid },
    relations: {
      ProductCategories: true,
      ProductTags: true,
      brands: {
        model: true,
      },
    },
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 406));
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});
// Delete Product
exports.deleteProduct = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;

  if (isNaN(req.params.id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await Product.findOne({
    where: { id: parseInt(req.params.id), clientguid: client.clientguid },
    relations: {
      ProductCategories: true,
      ProductTags: true,
    },
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 406));
  }
  product.deletedBy = token.guid;
  product.isDeleted = 1;
  await Product.save(product);
  product.ProductCategories = product.ProductCategories.filter((category) => {
    category.id !== product.id;
  });
  product.ProductTags = product.ProductTags.filter((tag) => {
    tag.id !== product.id;
  });
  await product.save();
  await ProductRepository.softRemove(product);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const id = req.params.id;
  if (isNaN(id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await ProductRepository.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!product) {
    return res.status(200).json({
      success: true,
      message: "Product not found",
      data: [],
    });
  }
  const checkDuplicateSKU = await ProductRepository.findOne({
    where: {
      id: Not(id),
      sku: body.sku,
      clientguid: client.guid,
    },
  });
  if (checkDuplicateSKU) {
    return res.status(422).json({
      success: true,
      data: [],
      message: "Product SKU  already exists",
    });
  }

  let getCategories = await CategoryRepository.createQueryBuilder()
    .where({ id: In(body.defaultCategoryId) })
    .getMany();
  let getTags = await TagsRepository.createQueryBuilder()
    .where({ id: In(body.defaultTagId) })
    .getMany();
  let getBrands = await BrandRepository.createQueryBuilder()
    .where({ id: body.brandId })
    .getOne();
  const updatedProduct = {
    brands: getBrands,
    ProductCategories: getCategories,
    ProductTags: getTags,
    ...body,
    updateBy: token.guid,
  };
  const mergedProduct = await ProductRepository.merge(product, updatedProduct);
  const response = await ProductRepository.save(mergedProduct);
  return res.status(200).json({
    success: true,
    data: response,
  });
});
//  Disable Product
exports.disableProduct = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body } = req;
  if (isNaN(req.params.id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await Product.findOne({
    where: { id: parseInt(req.params.id), clientguid: client.clientguid },
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 406));
  }
  const status = await ProductStatus.findOne({
    where: { id: PRODUCT_STATUS.INACTIVE },
  });

  const responder = await Product.merge(product, {
    productStatus: status?.id,
  });
  await Product.save(responder);
  return res.status(200).json({
    success: true,
    message: "Product disabled successfully",
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { client } = req;
  const products = await Product.find({
    relations: {
      ProductCategories: true,
      ProductTags: true,
      brands: {
        model: true,
      },
    },
    where: { clientguid: client.clientguid },
  });
  if (products.length == 0) {
    return next(new ErrorHandler("Products not found", 200));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});
// Get product Status
exports.getProductStatus = catchAsyncErrors(async (req, res, next) => {
  const { client } = req;

  const productStatus = await ProductStatus.find();
  if (!productStatus) {
    return next(new ErrorHandler("Product Status not found", 406));
  }

  return res.status(200).json({
    success: true,
    productStatus,
  });
});
// Get product Types

exports.getProductTypes = catchAsyncErrors(async (req, res, next) => {
  const productTypes = await ProductType.find();
  if (!productTypes) {
    return next(new ErrorHandler("Product Types not found", 406));
  }
  return res.status(200).json({
    success: true,
    productTypes,
  });
});
// Add Stock
exports.addStock = catchAsyncErrors(async (req, res, next) => {
  const { body, client } = req;

  if (isNaN(req.params.id)) {
    return next(
      new ErrorHandler("Product id cannot be null or undefined", 400)
    );
  }
  const product = await Product.findOne({
    where: { id: req.params.id, clientguid: client.clientguid },
  });
  const updatedStock = Number(product?.stock) + body.stock;
  const update = await Product.createQueryBuilder()
    .update(Product)
    .set({ stock: updatedStock })
    .where("id =:id", { id: product?.id })
    .execute();
  return res.status(200).json({
    success: true,
    update,
  });
});

// Get All Product with query params
exports.getAllProductsFE = catchAsyncErrors(async (req, res, next) => {
  const { query } = req;
  const take = query.take || 30;
  const skip = query.skip || 0;
  const keyword = query.keyword || "";

  const [result, total] = await ProductRepository.findAndCount({
    where: { title: Like("%" + keyword + "%") },
    order: { id: "DESC" },
    take: take,
    skip: skip,
    relations: {
      ProductCategories: true,
      ProductTags: true,
    },
  });

  return res.status(200).json({
    success: true,
    data: result,
    count: total,
  });
});
