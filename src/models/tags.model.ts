import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToMany,
} from "typeorm";
import { Product } from "./product.model";
@Entity("Tags")
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  title: string;
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
  slug: string;
  @Column("int")
  isSpecial: number;
  @DeleteDateColumn()
  deletedAt: Date;
  @ManyToMany(() => Product, (product) => product.ProductTags)
  product: Product[];
}
