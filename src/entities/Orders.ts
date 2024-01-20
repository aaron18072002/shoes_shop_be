import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { SalesItems } from './SalesItems';
import { Customers } from './Customers';
import { OrderStatus } from '../constants/Status';

@Entity(DBTable.ORDERS)
export class Orders extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        nullable: false,
        default: OrderStatus.PENDING,
    })
    order_status: OrderStatus;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    total_amount: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    payment_method: string;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    delivery_method: string;

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

    @OneToMany(() => SalesItems, (salesItems) => salesItems.orders)
    salesItems: SalesItems[];

    @Column({
        type: 'uuid',
        nullable: true,
    })
    customer_id: string;

    @ManyToOne(() => Customers, (customers) => customers.orders, {
        eager: true,
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({
        name: 'customer_id',
    })
    customers: Customers;

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
