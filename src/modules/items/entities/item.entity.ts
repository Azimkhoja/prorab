import { Category } from 'src/modules/category/entities/category.entity';
import Model from 'src/modules/model/model.module';
import { Counter } from 'src/modules/counter/entities/counter.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('Items')
export class Items extends Model {
  @Column({nullable: false, unique: true})
  name: string;

  @Column({nullable: true})
  name_alias: string;

  @ManyToOne(()=> Category, category=> category.items)
  
  @JoinColumn({name: "category_id"})
  category: Category; 
  
  @Column()
  category_id: number;

  @OneToMany(() => Counter, counter => counter.items, {nullable:true})
  counters: Counter[];


}
