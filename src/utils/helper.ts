// import DataLoader from "dataloader";
import { In } from "typeorm";
import { Product } from "../models/product.model";
import { ProductCategory } from "../models/productcategory.model";
const batchProduct = async (categoryId) => {
  const productsCategory = await ProductCategory.find({
    join: {
      alias: "productCategory",
      innerJoinAndSelect: {
        product: "productCategory.product",
      },
    },
    where: {
      categoryid: categoryId,
    },
  });

  const CategoryToProduct: { [key: number]: Product[] } = {};

  productsCategory.forEach((ab) => {
    if (ab.categoryid in CategoryToProduct) {
      CategoryToProduct[ab.categoryid].push((ab as any).product);
    } else {
      CategoryToProduct[ab.categoryid] = [(ab as any).product];
    }
  });

  return productsCategory;
};

export const createProductLoader = batchProduct;
export function makeId() {
  let ID = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 12; i++) {
    ID += characters.charAt(Math.floor(Math.random() * 36));
  }
  return ID;
}
