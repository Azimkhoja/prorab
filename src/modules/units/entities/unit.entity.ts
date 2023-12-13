import { Counter } from "src/modules/counter/entities/counter.entity";
import Model from "src/modules/model/model.module";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('Units')

export class Units  extends Model {
    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    name_alias: string;

    @OneToMany(() => Counter, item => item.units)
    counters: Counter[]


}
