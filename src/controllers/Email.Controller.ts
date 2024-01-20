import { NextFunction, Request, Response } from 'express';
import emailServies from '~/services/Email.services';

export const sendEmailController = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { email } = req.body;
    const user_id = req.user_id;
    const { data, status, msg } = await emailServies.sendEmail(email, user_id);
    return res.status(status).json({
        msg,
        data,
    });
};

export const sendEmailToMeController = async (req: Request, res: Response, next: NextFunction) => {

}