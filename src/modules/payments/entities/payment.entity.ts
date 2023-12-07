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
  
  @JoinColumn({name: 'counter_id'})
  counters: Counter;
  
  @Column({nullable: true})
  counter_id: number
  
  @ManyToOne(() => Clients, clients => clients.payments)
  
  @JoinColumn({name: 'client_id'})
  clients: Clients;
  
  @Column({nullable:true})
  client_id: number

}
