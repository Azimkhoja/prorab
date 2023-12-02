import { Items } from "src/modules/items/entities/item.entity";
import Model from "src/modules/model/model.module";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('Category')
export class Category extends Model {

    @Column()
    name: string;
  
    @Column({nullable: true})
    name_alias: string;
    
    @OneToMany(() => Items, items => items.category)
    items : Items[];
}
