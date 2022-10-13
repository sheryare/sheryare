import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Model } from "./models.model";
import { Product } from "./product.model";
@Entity("Brands")
export class Brands extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  title: string;
  @Column("varchar")
  slug: string;
  @Column("varchar")
  featuredImage: string;
  @Column("tinyint")
  deleted: number;
  @Column("varchar")
  createBy: string;
  @Column("varchar")
  updateBy: string;
  @DeleteDateColumn()
  deletedAt: Date;
  @Column("varchar", { length: 500 })
  description: string;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @OneToMany(() => Model, (model) => model.brands)
  public model: Model[];
  @OneToMany(() => Product, (product) => product.brands)
  public product: Product[];
}
