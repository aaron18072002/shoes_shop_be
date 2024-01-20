import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

export class ErrorHandler {
    static catchErrors(fn: any) {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch((err) => next(err));
        };
    }

    static handleError(err: any, req: Request, res: Response, next: NextFunction) {
        if (err instanceof EntityNotFoundError) {
            return res.status(404).json({
                success: false,
                msg: 'Page/Item you are looking for does not exist',
                error: err,
            });
        }

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong !',
            error: err,
        });
    }
}
