import { DataSource } from 'typeorm';
import {
    Brands,
    Categories,
    Products,
    Promotions,
    RefreshTokens,
    Suppliers,
    Users,
    Orders,
    Customers,
} from '../entities';
import { SalesItems } from '../entities/SalesItems';
import { envConfig } from '~/constants/Config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: envConfig.DB_HOST,
    port: Number(envConfig.DB_PORT),
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_DATABASE,
    logging: true,
    synchronize: true,
    entities: [
        Products,
        Categories,
        Suppliers,
        Brands,
        SalesItems,
        Users,
        RefreshTokens,
        Promotions,
        Orders,
        Customers,
    ],
    subscribers: [],
});

// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: 'arjuna.db.elephantsql.com',
//     port: 5432,
//     username: 'bmolnltk',
//     password: 'EPm_9AguKmn44phOJCFyUc-ploS4iApE',
//     database: 'bmolnltk',
//     synchronize: true,
//     entities: [
//         Products,
//         Categories,
//         Suppliers,
//         Brands,
//         SalesItems,
//         Users,
//         RefreshTokens,
//         Promotions,
//         Orders,
//         Customers,
//     ],
//     subscribers: [],
// });
