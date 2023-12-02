import { Clients } from 'src/modules/clients/entities/client.entity';
import { Items } from 'src/modules/items/entities/item.entity';
import Model from 'src/modules/model/model.module';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Payments')
export class Payments extends Model {
  @Column({ type: 'decimal', scale: 2, precision: 20 })
  amount: number;

  @Column()
  usd_rate: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  amount_usd: number;

  @Column()
  date: Date;

  @ManyToOne(() => Items, items => items.payments)
  items: Items;

  @JoinColumn({name: 'item_id'})
  item_id: number
  
  @ManyToOne(() => Clients, clients => clients.payments)
  clients: Clients;
  
  @JoinColumn({name: 'client_id'})
  client_id: number

}
