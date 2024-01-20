import express from 'express';
import { ProductsController } from '../controllers/ProductsController';
import { ErrorHandler } from '../middlewares/ErrorHandler';

const router = express.Router();

const productsController = new ProductsController();

// Get men products
// Route: /products/men
// query: { limit, page, type }
router.get('/men', ErrorHandler.catchErrors(productsController.getMenProducts));

// Get men products
// Route: /products/women
router.get('/women', ErrorHandler.catchErrors(productsController.getWomenProducts));

// Get kids products
// Route: /products/kids
router.get('/options', ErrorHandler.catchErrors(productsController.getProductsByOption));

// Get product by id
// Route: /products/:id
// Params: { id }
router.get('/:id', ErrorHandler.catchErrors(productsController.getProductById));

export default router;
