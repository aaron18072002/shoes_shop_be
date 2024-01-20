import express, { Express, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import productsRoutes from './routes/products.routes';
import usersRoutes from './routes/users.routes';
import promotionsRoutes from './routes/promotions.routes';
import ordersRoutes from './routes/orders.routes';
import salesItemsRoutes from './routes/salesItems.routes';
import customersRoutes from './routes/customers.routes';
import staticRoutes from './routes/statics.routes';
import emailRoutes from './routes/email.routes';
import { ErrorHandler } from './middlewares/ErrorHandler';
import { envConfig, isProduction } from './constants/Config';

const app: Express = express();

app.use(helmet());
const corsOptions: CorsOptions = {
    origin: isProduction ? envConfig.CLIENT_URL : '*',
};
app.use(
    cors({
        origin: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/promotions', promotionsRoutes);
app.use('/orders', ordersRoutes);
app.use('/sales_items', salesItemsRoutes);
app.use('/customers', customersRoutes);
app.use('/static', staticRoutes);
app.use('/email', emailRoutes);

app.use('*', (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        msg: 'Invalid path',
    });
});

// Define a middleware function to handle the error from controller
app.use(ErrorHandler.handleError);

app.use('/hello', (req, res, next) => {
    return res.status(200).json({
        msg: 'Hello',
    });
});

export default app;
