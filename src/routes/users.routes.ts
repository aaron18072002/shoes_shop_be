import express from 'express';
import { ErrorHandler } from '../middlewares/ErrorHandler';
import { UsersController } from '../controllers/UsersController';
import accessTokenValidator from '../validators/accessTokenValidator';
import refreshTokenValidator from '../validators/refreshTokenValidator';

const router = express.Router();

const usersController = new UsersController();

// register
// req.body: { name, email, password, gender, role }
router.post('/register', ErrorHandler.catchErrors(usersController.register));

// path: /users/oauth/google
// method: get
// body: { code: string }
router.get('/oauth/google',  ErrorHandler.catchErrors(usersController.oauthGoogleController));

// login
// body: { email, password }
router.post('/login', ErrorHandler.catchErrors(usersController.login));

// /users/logout
// Header: { Authoraztion: Bearer <access_token> }
// body: { refresh_token: string }
router.post('/log-out', accessTokenValidator, ErrorHandler.catchErrors(usersController.logout));

// Get user by id
router.get('/:id', refreshTokenValidator, ErrorHandler.catchErrors(usersController.getUserById));

// Header: { Authoraztion: Bearer <refresh_token> }
router.post(
    '/refresh-token',
    refreshTokenValidator,
    ErrorHandler.catchErrors(usersController.refreshToken),
);

// Update user
// Params: { id }
// Body: { name, gender }
router.patch('/update_user/:id', ErrorHandler.catchErrors(usersController.updateUser));

// Update user
// Params: { user_id }
// Body: { old_password, password }
router.put('/change_password/:user_id', ErrorHandler.catchErrors(usersController.changePassword));

// Reset password
// Params: { user_id }
// Body: {  password }
router.post('/reset-password/:user_id', ErrorHandler.catchErrors(usersController.resetPassword));

export default router;
