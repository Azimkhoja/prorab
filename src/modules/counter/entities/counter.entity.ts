import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import Model from '../../model/model.module'
import {Units} from "../../units/entities/unit.entity"
import { Items } from "src/modules/items/entities/item.entity";
import { Payments } from 'src/modules/payments/entities/payment.entity';

@Entity('Counter')
export class Counter extends Model {

    @Column()
    qty: number
    
    @ManyToOne(() => Units, units => units.counters)
    units: Units

    @JoinColumn({name: "unit_id"})
    unit_id: number
    
    @ManyToOne(() => Items, items => items.counters)
    items: Items;
    
    @JoinColumn({name: "item_id"})
    item_id: number

    @OneToMany(() => Payments, payments => payments.counters)
    payments: Payments[];

}