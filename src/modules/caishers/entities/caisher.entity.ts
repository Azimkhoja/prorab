import { Clients } from "src/modules/clients/entities/client.entity";
import Model from "src/modules/model/model.module";
import { Payments } from "src/modules/payments/entities/payment.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity('Caisher')
export class Caisher extends Model {

    @Column({nullable: false})
    name: string;
    
    @Column({})
    is_active: boolean;

    @OneToMany(() => Payments, payments => payments.caisher, {onDelete: 'RESTRICT', nullable: false})
    payments: Payments[]

    @OneToMany(() => Clients, clients => clients.caisher)
    clients: Clients[]

}
