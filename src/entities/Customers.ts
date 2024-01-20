import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { Users } from './Users';
import { Orders } from './Orders';

@Entity(DBTable.CUSTOMERS)
export class Customers extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 11,
        nullable: true,
        unique: true,
    })
    phone_number: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
    })
    address: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
    })
    city: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
    })
    country: string;

    @Column({
        type: 'uuid',
        nullable: true,
    })
    user_id: string;

    @OneToOne(() => Users, (user) => user.customer)
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @OneToMany(() => Orders, (orders) => orders.customers)
    orders: Orders[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;
}
