import express from 'express';
import { ErrorHandler } from '../middlewares/ErrorHandler';
import { SalesItemsController } from '../controllers/SalesItems.Controller';

const router = express.Router();

const salesItemsController = new SalesItemsController();

// create sales item
// body: {  }
router.post('/create', ErrorHandler.catchErrors(salesItemsController.create));

// get sales items by order id
// params: { order_id }
router.get('/:order_id', ErrorHandler.catchErrors(salesItemsController.getSalesItemsByOrderId));

export default router;
