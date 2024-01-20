import jwt, { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '~/constants/Config';

export default function generalNewAcessToken(token: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = jwt.verify(
                token,
                (envConfig.REFRESH_KEY_SECRET as string) || 'refreshKeySecret123',
            );
            if (!decoded) {
            }
        } catch (error) {
            throw new Error(error);
        }
    });
}
