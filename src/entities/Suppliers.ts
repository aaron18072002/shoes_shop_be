import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { Products } from './Products';
import { Status } from '../constants/Status';

@Entity(DBTable.SUPPLIERS)
export class Suppliers extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'integer' })
    id: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
        unique: true,
    })
    name: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.AVAILABLE,
    })
    status: Status;

    @Column({
        type: 'char',
        precision: 10,
        nullable: false,
        unique: true,
        default: '',
    })
    phone_number: Status;

    @OneToMany(() => Products, (products) => products.supplier)
    products: Products[];

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
