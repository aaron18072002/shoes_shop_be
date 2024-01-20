import express from 'express';
import { ErrorHandler } from '../middlewares/ErrorHandler';
import { serveImageController, uploadImagesController } from '../controllers/Static.Controller';

const router = express.Router();

// upload image
// method: post
// body: { image }
// router: /static/image
router.post('/image', ErrorHandler.catchErrors(uploadImagesController));

// get static image
// method: get
// router: /static/media/:name
router.get('/medias/:name', ErrorHandler.catchErrors(serveImageController));

export default router;
