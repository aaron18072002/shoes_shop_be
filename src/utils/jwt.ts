import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export const signToken = async ({
    payload,
    privateKey,
    options = {
        algorithm: 'HS256',
    },
}: {
    payload: string | Buffer | object | undefined;
    privateKey: string;
    options?: SignOptions;
}): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                throw reject(err);
            }
            resolve(token as string);
        });
    });
};
