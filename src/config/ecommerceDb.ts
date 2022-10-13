import { OrderItems } from "../models/orderItems.model";
import { Orders } from "../models/order.model";
import { Category } from "../models/category.model";
import { ProductCategory } from "../models/productcategory.model";
import { Product } from "../models/product.model";
import { ProductStatus } from "../models/productstatus.model";
import { ProductType } from "../models/producttype.model";
import { CartType } from "../models/carttypes.model";
import { OrderStatus } from "../models/orderstatus.model";
import { DeliveryType } from "../models/deliverytypes";
import { Tags } from "../models/tags.model";
import { Model } from "../models/models.model";
import { Brands } from "../models/brand.model";

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: "mysql",
  host: "45.200.120.78",
  port: 3306,
  username: "ecommerceuser",
  password: "8hRE+zpyLk",
  database: "Ecommerce",
  entities: [
    Product,
    ProductCategory,
    Category,
    OrderItems,
    Orders,
    ProductStatus,
    ProductType,
    CartType,
    OrderStatus,
    DeliveryType,
    Tags,
    Model,
    Brands,
  ],
  logging: true,
  // synchronize: true,
});
export default myDataSource;
