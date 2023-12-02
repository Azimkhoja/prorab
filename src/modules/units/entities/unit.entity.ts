import { Items } from "src/modules/items/entities/item.entity";
import Model from "src/modules/model/model.module";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('Units')

export class Units  extends Model {
    @Column({nullable: false})
    name: string;

    @Column()
    name_alias: string;

    @OneToMany(() => Items, item => item.units)
    items: Items[]
}
