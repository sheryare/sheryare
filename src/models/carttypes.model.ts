import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
@Entity("CartType")
export class CartType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  title: string;
}
