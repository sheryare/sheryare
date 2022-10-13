import { In, Like, Not } from "typeorm";
import { Request, Response } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import slugify from "slugify";
import { Brands } from "../models/brand.model";
import { Model } from "../models/models.model";
import { Product } from "../models/product.model";
const BrandRepository = myDataSource.getRepository(Brands);
const ModelRepository = myDataSource.getRepository(Model);
const ProductRepository = myDataSource.getRepository(Product);

exports.createBrand = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body, token } = req;
  let slug = slugify(body.title, {
    lower: true,
  });

  let checkDuplicate = await BrandRepository.find({
    where: {
      slug: Like("%" + slug + "%"),
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
  const createBrand = await Brands.create({
    ...body,
    slug,
    clientguid: client.clientguid,
    createBy: token.guid,
    featuredImage: body.featuredImage,
  });
  const brand = await Brands.save(createBrand);
  return res.status(200).json({
    success: true,
    brand,
    message: "Brand has been created successfully",
  });
});
// Update Brand
exports.updateBrand = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Brand id cannot be null or undefined", 400));
  }

  const brand = await BrandRepository.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!brand) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "brand not found",
    });
  }

  const updateBrand = {
    ...body,
    updateBy: token.guid,
  };
  const mergedBrand = await Brands.merge(brand, updateBrand);

  const response = await Brands.save(mergedBrand);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Brand has been Updated successfully",
  });
});
// Delete Brand
exports.deleteBrand = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Brand id cannot be null or undefined", 400));
  }
  const brand = await Brands.findOne({
    where: { id: id, clientguid: client.clientguid },
  });

  if (!brand) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Brand not found",
    });
  }
  brand.deleted = 1;
  await brand.save();
  const modelBrand = await ModelRepository.find({
    where: { brandid: brand.id },
  });
  if (modelBrand.length > 0) {
    const modelIds = modelBrand.map((e) => e.id);
    await ModelRepository.createQueryBuilder()
      .update()
      .set({ deleted: 1 })
      .where({ id: In(modelIds) })
      .execute();
    await ModelRepository.createQueryBuilder()
      .softDelete()
      .from(Model)
      .where({ id: In(modelIds) })
      .execute();
  }
  const productBrand = await ProductRepository.find({
    where: { brandId: brand.id },
  });
  if (productBrand.length > 0) {
    const productIds = productBrand.map((e) => e.id);

    await ProductRepository.createQueryBuilder()
      .update(Product)
      .set({ brandId: null, modelId: null })
      .where({ id: In(productIds) })
      .execute();
  }

  await BrandRepository.softDelete(id);

  return res.status(200).json({
    success: true,
    message: "Brand has been deleted successfully",
  });
});

// Get All Brands
exports.getAllBrands = catchAsyncErrors(async function (
  req: any,
  res: Response
) {
  const { client } = req;
  const brands = await BrandRepository.find({
    where: { clientguid: client.clientguid, deleted: 0 },
    relations: {
      model: true,
    },
  });
  if (brands.length == 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Brands not found",
    });
  }
  return res.status(200).json({
    success: true,
    brands,
  });
});
// Get Brand Details by id
exports.getSingleBrandById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Brand id cannot be null or undefined", 400));
  }
  const brand = await Brands.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!brand) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Brand not found",
    });
  }

  return res.status(200).json({
    success: true,
    brand,
  });
});
// Get single Brand by slug
exports.getSingleBrandBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const slug = req.params.slug;
  const brand = await Brands.findOne({
    where: { slug: slug, clientguid: client.clientguid },
  });
  if (!brand) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Brand not found",
    });
  }

  return res.status(200).json({
    success: true,
    brand,
  });
});
