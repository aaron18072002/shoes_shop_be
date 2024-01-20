import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '~/databse/data-source';
import validator from 'validator';
import { Users } from '~/entities';

export const EmailValidator = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            msg: 'Email is not valid',
        });
    }
    const user = await AppDataSource.getRepository(Users).findOneBy({
        email,
    });
    if (!user) {
        return res.status(404).json({
            msg: 'User not found',
        });
    }
    (req as Request).user_id = user.id;
    next();
};
