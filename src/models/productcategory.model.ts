import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "./category.model";
import { Product } from "./product.model";
@Entity("ProductCategory")
export class ProductCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @PrimaryColumn()
  productid: number;

  @PrimaryColumn()
  categoryid: number;
  // @ManyToOne(() => Product, (product) => product.productCategory)
  // @JoinColumn({ name: "productid" })
  // public product: Product;

  // @ManyToOne(() => Category, (category) => category.productCategories)
  // @JoinColumn({ name: "categoryid" })
  // public category: Category;
}
