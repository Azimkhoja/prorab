import { Clients } from 'src/modules/clients/entities/client.entity';
import { Counter } from 'src/modules/counter/entities/counter.entity';
import Model from 'src/modules/model/model.module';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Payments')
export class Payments extends Model {
  @Column({ type: 'decimal', scale: 2, precision: 20, default: 0})
  amount: number;

  @Column()
  usd_rate: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  amount_usd: number;

  @Column()
  date: Date;

  @ManyToOne(() => Counter, counter => counter.payments)
  counters: Counter;

  @JoinColumn({name: 'counter_id'})
  counter_id: number
  
  @ManyToOne(() => Clients, clients => clients.payments)
  clients: Clients;
  
  @JoinColumn({name: 'client_id'})
  client_id: number

}
