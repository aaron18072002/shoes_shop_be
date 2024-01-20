import express from 'express';
import { sendEmailController } from '~/controllers/Email.Controller';
import { EmailValidator } from '~/middlewares/EmailValidator';
import { ErrorHandler } from '~/middlewares/ErrorHandler';

const router = express.Router();

/*
  Method: post
  Desc: Send mail to user to handle forgot password
  Body: { email }
*/
router.post('/send-email', EmailValidator, ErrorHandler.catchErrors(sendEmailController));

export default router;
