import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

import { DBTable } from '../constants/DBTable';
import { Status } from '../constants/Status';
import { Colors } from '~/constants/Color';
import { GenderTypes } from '../constants/GenderTypes';
import { Categories } from './Categories';
import { Suppliers } from './Suppliers';
import { Brands } from './Brands';
import { SalesItems } from './SalesItems';
import { Promotions } from './Promotions';

@Entity(DBTable.PRODUCTS)
export class Products extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
        unique: true,
        default: '',
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
        default: '',
    })
    description: string;

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
        type: 'enum',
        enum: Status,
        default: Status.AVAILABLE,
    })
    status: Status;

    @Column('text', { array: true, nullable: false })
    images: string[];

    @Column({
        type: 'enum',
        enum: Colors,
        nullable: false,
    })
    color: Colors;

    @Column({
        type: 'enum',
        enum: GenderTypes,
        nullable: false,
    })
    gender_type: GenderTypes;

    @ManyToOne(() => Categories, (categories) => categories.products, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'category_id',
    })
    category: Categories;

    @ManyToOne(() => Suppliers, (suppliers) => suppliers.products, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'supplier_id',
    })
    supplier: Suppliers;

    @ManyToOne(() => Brands, (brands) => brands.products, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'brand_id',
    })
    brand: Suppliers;

    @Column({ name: 'promotion_id', nullable: true })
    promotionId: number;

    @ManyToOne(() => Promotions, (promotions) => promotions.products, {
        eager: true,
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({
        name: 'promotion_id',
    })
    promotion: Promotions;

    @OneToMany(() => SalesItems, (salesItems) => salesItems.products)
    salesItems: SalesItems[];

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    is_discount: boolean;

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
