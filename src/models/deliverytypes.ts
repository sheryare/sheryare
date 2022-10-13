import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
@Entity("DeliveryType")
export class DeliveryType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  title: string;
}
