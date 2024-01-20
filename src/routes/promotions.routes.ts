import express from 'express';
import { PromotionsController } from '../controllers/PromotionsController';
import { ErrorHandler } from '../middlewares/ErrorHandler';

const router = express.Router();

const promotionsController = new PromotionsController();

// Get promotion by id
// Route: /promotion/:id
// Params: { id }
router.get('/:id', ErrorHandler.catchErrors(promotionsController.getPromotionById));

export default router;
