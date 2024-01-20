import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Products } from './Products';
import { DBTable } from '../constants/DBTable';

@Entity(DBTable.BRANDS)
export class Brands extends BaseEntity {
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
        type: 'text',
        nullable: false,
        default: '',
    })
    description: string;

    @OneToMany(() => Products, (products) => products.brand)
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
