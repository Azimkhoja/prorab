import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from '../../model/model.module';

@Entity('ExchangeRates')
export class ExchangRates extends Model {
  @Column({ type: 'float' })
  rate_value: number;

  @Column()
  is_default: boolean;

 
  @Column({nullable:true})
  user_id:number;

  
}
