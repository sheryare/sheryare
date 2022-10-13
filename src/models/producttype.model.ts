import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Product } from "./product.model";
@Entity("ProductType")
export class ProductType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  title: string;
  @Column("varchar")
  description: string;
}
