import { Product } from "../models/product.model";
import myDataSource from "../config/ecommerceDb";
import { Like } from "typeorm";

const ProductRepository = myDataSource.getRepository(Product);

export async function checkDuplicatSKU(sku, client) {
  const duplicateSKU = await ProductRepository.findOne({
    where: { sku: sku, clientguid: client.clientguid },
  });
  return duplicateSKU;
}

export async function checkDuplicatSlug(slug, client) {
  const duplicateSlug = await ProductRepository.find({
    where: { slug: Like("%" + slug + "%"), clientguid: client.clientguid },
  });
  return duplicateSlug;
}
