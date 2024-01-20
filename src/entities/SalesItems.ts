import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { Products } from './Products';
import { Orders } from './Orders';

@Entity(DBTable.SALESITEMS)
export class SalesItems extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'integer' })
    id: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    price: number;

    @Column({
        type: 'integer',
        nullable: false,
    })
    quantity: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    size: string;

    @Column({
        type: 'uuid',
        nullable: true,
    })
    product_id: string;

    @Column({
        type: 'uuid',
        nullable: true,
    })
    order_id: string;

    @ManyToOne(() => Products, (products) => products.salesItems, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
    })
    products: Products;

    @ManyToOne(() => Orders, (orders) => orders.salesItems, {
        eager: true,
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({
        name: 'order_id',
    })
    orders: Orders;

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
