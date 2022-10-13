import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Brands } from "./brand.model";
import { Category } from "./category.model";
import { Model } from "./models.model";
import { OrderItems } from "./orderItems.model";
import { ProductCategory } from "./productcategory.model";
import { Tags } from "./tags.model";

@Entity("Product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar", { nullable: false })
  title: string;
  @Column("varchar", { nullable: false, length: 500 })
  description: string;
  @Column("varchar")
  featuredImage: string;
  @Column("varchar", { length: 300 })
  shortDescription: string;
  @Column("decimal")
  stock: number;
  @Column("decimal")
  alarmStock: number;
  @Column("varchar")
  unit: string;
  @Column("float", { nullable: false })
  listPrice: number;
  @Column("varchar", { unique: true, nullable: false })
  sku: string;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @Column("varchar")
  createBy: string;
  @Column("varchar")
  updateBy: string;
  @Column("tinyint")
  isDeleted: number;
  @DeleteDateColumn()
  deletedAt: Date;
  @Column("varchar")
  deletedBy: string;
  @Column("varchar")
  slug: string;
  @Column("longtext")
  additionalInfo: string;
  @Column("tinyint")
  unlimited: number;
  @Column("tinyint")
  inStock: number;
  @Column("longtext")
  nameTranslated: string;
  @Column("float")
  costPrice: number;
  @Column("longtext")
  taxInfo: string;
  @Column({ type: "longtext" })
  productCategories: any;
  @Column({ type: "longtext" })
  productTags: any;
  @Column("tinyint")
  isShippingRequired: number;
  @Column("double")
  weight: number;
  @Column("tinyint")
  fixedShippingRateOnly: number;
  @Column("float")
  fixedShippingRate: number;
  @Column({ type: "simple-array" })
  defaultCategoryId: string[];
  @Column({ type: "simple-array" })
  defaultTagId: string[];
  @Column("tinyint")
  showOnFrontpage: number;
  @Column("tinyint")
  isSampleProduct: number;
  @Column("tinyint")
  discountsAllowed: string;
  @Column("varchar")
  subtitle: string;
  @Column()
  productStatus: number;
  @Column()
  productType: number;
  @Column("simple-array")
  images: string[];
  @Column("int", { nullable: true })
  brandId: number;
  @Column("int", { nullable: true })
  modelId: number;
  @ManyToOne(() => Brands, (brands) => brands.product, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "brandId" })
  brands: Brands[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  public orderItems: OrderItems[];
  @ManyToMany(() => Category, (category) => category.product, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinTable()
  ProductCategories: Category[];
  @ManyToMany(() => Tags, (tag) => tag.product, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinTable()
  ProductTags: Tags[];
}
