import {
    BaseEntity,
    Column,
    Entity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { DBTable } from '../constants/DBTable';
import { Users } from './Users';

@Entity(DBTable.REFRESH_TOKENS)
export class RefreshTokens extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    token: string;

    // @OneToOne(() => Users, { onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true })
    // @JoinColumn({ name: 'userId' })
    // user: Users;

    @Column({
        type: 'uuid',
        unique: true,
    })
    userId: string;

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
