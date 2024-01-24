import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';

import { DBTable } from '../constants/DBTable';
import { Roles } from '../constants/Roles';
import { Genders } from '../constants/Genders';
import { Customers } from './Customers';

@Entity(DBTable.USERS)
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
        unique: true,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'enum',
        enum: Genders,
        default: Genders.MALE,
    })
    gender: Genders;

    @Column({
        type: 'enum',
        enum: Roles,
        nullable: true,
        default: Roles.USER,
    })
    role: Roles;

    @Column({
        type: 'text',
        nullable: true,
        default: '70491d7d086829a40cff67f00',
    })
    avatar_img: string;

    @Column({ nullable: true, type: 'date' })
    day_of_birth: Date;

    @OneToOne(() => Customers, (customer) => customer.user)
    customer: Customers;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

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
