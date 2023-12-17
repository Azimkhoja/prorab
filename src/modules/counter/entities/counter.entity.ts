import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import Model from '../../model/model.module'
import {Units} from "../../units/entities/unit.entity"
import { Items } from "src/modules/items/entities/item.entity";
import { Payments } from 'src/modules/payments/entities/payment.entity';

@Entity('Counter')
export class Counter extends Model {

    @Column({nullable:true})
    qty: number
    
    @ManyToOne(() => Units, units => units.counters)
    
    @JoinColumn({name: "unit_id"})
    units: Units
    
    @Column()
    unit_id: number
    
    @ManyToOne(() => Items, items => items.counters)
    
    @JoinColumn({name: "item_id"})
    items: Items;
    
    @Column()
    item_id: number

    @OneToMany(() => Payments, payments => payments.counters, {nullable: true, onDelete:'CASCADE', onUpdate: 'CASCADE'})
    payments: Payments[];
        
}