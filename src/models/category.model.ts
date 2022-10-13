import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Product } from "./product.model";
import { ProductCategory } from "./productcategory.model";
@Entity("Category")
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  title: string;
  @Column("varchar", { unique: true, nullable: true })
  categorykey: string;
  @Column("varchar")
  description: string;
  @Column("int")
  status: number;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @Column("varchar")
  deleteAt: Date;
  @Column("varchar")
  createBy: string;
  @Column("varchar")
  updateBy: string;
  @Column("varchar")
  deleteBy: string;
  @Column("varchar")
  featuredImage: string;
  @Column("varchar")
  slug: string;
  @Column("int")
  upperCategory: number;
  @Column("int")
  isSpecial: number;
  @DeleteDateColumn()
  deletedAt: Date;
  @ManyToMany(() => Product, (product) => product.ProductCategories)
  product: Product[];
}
