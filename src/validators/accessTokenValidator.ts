import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '~/constants/Config';

export default async function accessTokenValidator(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({
                msg: 'Refresh token is required',
            });
        }

        const decoded = jwt.verify(
            accessToken,
            (envConfig.ACCESS_KEY_SECRET as string) || 'accessKeySecret123',
        ) as JwtPayload;
        const dateNow = new Date();
        if ((decoded.exp as number) < dateNow.getTime() / 1000) {
            return res.status(401).json({
                msg: 'Token has expired',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Invalid access token',
            error,
        });
    }
}
