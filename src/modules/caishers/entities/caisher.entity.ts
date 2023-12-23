import Model from "src/modules/model/model.module";
import { Payments } from "src/modules/payments/entities/payment.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity('Caisher')
export class Caisher extends Model {

    @Column({nullable: false})
    name: string;
    
    @Column({})
    is_active: boolean;

    // @OneToMany(() => Payments, payments => payments.caisher)
    // payments: Payments[]


}
