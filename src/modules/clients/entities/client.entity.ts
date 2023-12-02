import { Column, Entity, OneToMany } from 'typeorm';
import Model from '../../model/model.module';
import { Payments } from 'src/modules/payments/entities/payment.entity';

@Entity('Clients')
export class Clients extends Model {
  @Column()
  name: string;

  @Column({nullable: true, unique: true})
  phone_number: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Payments, payments => payments.clients, {nullable: true})
  payments: Payments[];
}
