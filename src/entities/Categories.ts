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

@Entity(DBTable.CATEGORIES)
export class Categories extends BaseEntity {
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

    @OneToMany(() => Products, (products) => products.category)
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
