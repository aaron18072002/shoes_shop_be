import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { Products } from './Products';

@Entity(DBTable.PROMOTIONS)
export class Promotions extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'integer' })
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true,
    })
    name: string;

    @Column({ type: 'date', nullable: false })
    start_date: Date;

    @Column({ type: 'date', nullable: false })
    end_date: Date;

    @Column({ type: 'decimal', precision: 2, scale: 2, nullable: false })
    percent: number;

    @OneToMany(() => Products, (products) => products.promotion)
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
