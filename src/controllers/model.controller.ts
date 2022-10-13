import { In, Like } from "typeorm";
import { Response } from "express";
import { ErrorHandler } from "../utils/errorHandler";
import myDataSource from "../config/ecommerceDb";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import slugify from "slugify";
import { Model } from "../models/models.model";
import { Product } from "../models/product.model";
import { Brands } from "../models/brand.model";
const ModelRepository = myDataSource.getRepository(Model);
const ProductRepository = myDataSource.getRepository(Product);

exports.createModel = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, body, token } = req;
  let slug = slugify(body.title, {
    lower: true,
  });

  let checkDuplicate = await ModelRepository.find({
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
  const getBrand = await Brands.createQueryBuilder()
    .where({ id: body.brandid })
    .getOne();
  const createModel = await Model.create({
    ...body,
    slug,
    brands: getBrand,
    clientguid: client.clientguid,
    createBy: token.guid,
    featuredImage: body.featuredImage,
  });
  const model = await Model.save(createModel);
  return res.status(200).json({
    success: true,
    model,
    message: "Model has been created successfully",
  });
});
// Update Brand
exports.updateModel = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { body, client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Model id cannot be null or undefined", 400));
  }

  const model = await ModelRepository.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!model) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Model not found",
    });
  }

  const updateModel = {
    ...body,
    updateBy: token.guid,
  };
  const mergedModle = await Model.merge(model, updateModel);

  const response = await Model.save(mergedModle);
  return res.status(200).json({
    success: true,
    data: response,
    message: "Model has been Updated successfully",
  });
});
// Delete Model
exports.deleteModel = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client, token } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Model id cannot be null or undefined", 400));
  }
  const model = await Model.findOne({
    where: { id: id, clientguid: client.clientguid },
  });

  if (!model) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Model not found",
    });
  }
  model.deleted = 1;
  await model.save();
  const modelBrand = await ProductRepository.find({
    where: { modelId: model.id },
  });
  if (modelBrand.length > 0) {
    const productIds = modelBrand.map((e) => e.id);

    await ProductRepository.createQueryBuilder()
      .update(Product)
      .set({ modelId: null })
      .where({ id: In(productIds) })
      .execute();
  }
  await ModelRepository.softDelete(id);
  return res.status(200).json({
    success: true,
    message: "Model has been deleted successfully",
  });
});

// Get All Model
exports.getAllModels = catchAsyncErrors(async function (
  req: any,
  res: Response
) {
  const { client } = req;
  const models = await ModelRepository.find({
    where: { clientguid: client.clientguid, deleted: 0 },
  });
  if (models.length == 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Models not found",
    });
  }
  return res.status(200).json({
    success: true,
    models,
  });
});
// Get Model Details by id
exports.getSingleModelById = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return next(new ErrorHandler("Model id cannot be null or undefined", 400));
  }
  const model = await Model.findOne({
    where: { id: id, clientguid: client.clientguid },
  });
  if (!model) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Model not found",
    });
  }

  return res.status(200).json({
    success: true,
    model,
  });
});
// Get single Model by slug
exports.getSingleModelBySlug = catchAsyncErrors(async function (
  req: any,
  res: Response,
  next
) {
  const { client } = req;
  const slug = req.params.slug;
  const model = await Model.findOne({
    where: { slug: slug, clientguid: client.clientguid },
  });
  if (!model) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Model not found",
    });
  }

  return res.status(200).json({
    success: true,
    model,
  });
});
// get model for brand Id

exports.getAllModelsByBrandId = catchAsyncErrors(async function (
  req: any,
  res: Response
) {
  const { client } = req;
  const id = req.params.id;
  const models = await ModelRepository.find({
    where: { brandid: id, clientguid: client.clientguid, deleted: 0 },
  });
  if (models.length == 0) {
    return res.status(200).json({
      success: true,
      data: [],
      message: "Models not found for this Brand",
    });
  }
  return res.status(200).json({
    success: true,
    models,
  });
});
