import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Brands } from "./brand.model";
import { Product } from "./product.model";
@Entity("Model")
export class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  title: string;
  @Column("varchar")
  slug: string;
  @Column("tinyint")
  deleted: number;
  @Column("varchar")
  createBy: string;
  @Column("varchar")
  updateBy: string;
  @Column("varchar")
  featuredImage: string;
  @Column("varchar")
  brandid: string;
  @DeleteDateColumn()
  deletedAt: Date;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @ManyToOne(() => Brands, (brands) => brands.model, {
    cascade: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "brandid" })
  public brands: Brands[];
}
