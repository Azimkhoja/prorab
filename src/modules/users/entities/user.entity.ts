import Model from "src/modules/model/model.module";
import { Column, Entity } from "typeorm";

@Entity('Users')
export class User extends Model{

    @Column({nullable:false})
    first_name: string;
    
    @Column()
    last_name: string;
    
    @Column({nullable: false})
    username: string;
    
    @Column({nullable:false})
    password:string;
        
    @Column({nullable:true})
    token: string;
    
    @Column({default: true})
    is_active: boolean;

}
