import express from 'express';
import { OrdersController } from '../controllers/Orders.Controller';
import { ErrorHandler } from '../middlewares/ErrorHandler';

const router = express.Router();

const ordersController = new OrdersController();

// create order
// body: {  }
router.post('/create', ErrorHandler.catchErrors(ordersController.create));

// Get orders by customer_id
// params: { id }
router.get('/pending/:id', ErrorHandler.catchErrors(ordersController.getPendingOrdersByCustomerId));

// Get orders by customer_id
// params: { id }
router.get(
    '/processing/:id',
    ErrorHandler.catchErrors(ordersController.getProcessingOrdersByCustomerId),
);

// Get orders by customer_id
// params: { id }
router.get(
    '/delivered/:id',
    ErrorHandler.catchErrors(ordersController.getDeliveredOrdersByCustomerId),
);

// Get orders by customer_id
// params: { id }
router.get(
    '/cancelled/:id',
    ErrorHandler.catchErrors(ordersController.getCancelledOrdersByCustomerId),
);

export default router;
