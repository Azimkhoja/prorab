import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Model from '../../model/model.module';
import { Payments } from 'src/modules/payments/entities/payment.entity';
import { Caisher } from 'src/modules/caishers/entities/caisher.entity';

@Entity('Clients')
export class Clients extends Model {
  @Column()
  name: string;

  @Column({nullable: true, unique: true})
  phone_number: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Payments, payments => payments.clients)
  payments: Payments[];

  @ManyToOne(() => Caisher, caisher => caisher.clients)
  @JoinColumn({name: "caisher_id"})
  caisher: Caisher

  @Column()
  caisher_id: number
}
