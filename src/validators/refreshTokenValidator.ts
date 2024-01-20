import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '~/constants/Config';

export default async function refreshTokenValidator(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const refreshToken = req.headers.authorization.split(' ')[1];
        if (!refreshToken) {
            return res.status(401).json({
                msg: 'Refresh token is required',
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            (envConfig.REFRESH_KEY_SECRET as string) || 'refreshKeySecret123',
        ) as JwtPayload;
        const dateNow = new Date();
        if (decoded.exp < dateNow.getTime() / 1000) {
            return res.status(401).json({
                msg: 'Token has expired',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Invalid refresh token',
            error,
        });
    }
}
