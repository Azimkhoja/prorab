import { Category } from 'src/modules/category/entities/category.entity';
import Model from 'src/modules/model/model.module';
import { Payments } from 'src/modules/payments/entities/payment.entity';
import { Units } from 'src/modules/units/entities/unit.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('Items')
export class Items extends Model {
  @Column({nullable: false})
  name: string;

  @Column()
  name_alias: string;

  @Column({nullable: false})
  qty: number;
  
  @ManyToOne(()=> Category, category=> category.items)
  category: Category; 
  
  @JoinColumn({name: "category_id"})
  category_id: number;

  @ManyToOne(()=> Units, category=> category.items)
  units: Units;

  @JoinColumn({name: "unit_id"})
  unit_id: number;
  
  @OneToMany(() => Payments, payments => payments.items)
  payments: Payments[];


}
