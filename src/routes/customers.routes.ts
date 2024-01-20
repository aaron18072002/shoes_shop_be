import express from 'express';
import { CustomersController } from '../controllers/Customers.Controller';
import { ErrorHandler } from '../middlewares/ErrorHandler';

const router = express.Router();

const customersController = new CustomersController();

// create customer
// body: {  }
router.post('/create', ErrorHandler.catchErrors(customersController.create));

// get customer by user_id
// params: { user_id }
router.get('/user_id/:id', ErrorHandler.catchErrors(customersController.getCustomerByUserId));

// update customer by user_id
// params: { user_id }
// body: { data }
router.post(
    '/update/:user_id',
    ErrorHandler.catchErrors(customersController.updateCustomerByUserId),
);

export default router;
