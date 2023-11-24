import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Model from '../../model/model.module';

@Entity('Clients')
export class Clients extends Model {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  middle_name: string;

  @Column()
  tin: string;

  @Column({ enum: ['male', 'female'] })
  gender: string;

  @Column({ enum: ['jismoniy', 'yuridik'] })
  type: string;

  @Column()
  address: string;

  @Column()
  contact_number: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: false, unique: true })
  passport_seria: string;

  @Column({ nullable: false })
  given_from: string;

  @Column({ nullable: true })
  given_date: Date;

  @Column({ nullable: true })
  untill_date: Date;

  @Column({ nullable: true })
  legal_address: string;

  @Column({ nullable: true })
  registered_address: string;

  @Column({ nullable: true })
  description: string;
}
