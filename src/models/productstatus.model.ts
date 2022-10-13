import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Product } from "./product.model";
@Entity("ProductStatus")
export class ProductStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  title: string;
}
