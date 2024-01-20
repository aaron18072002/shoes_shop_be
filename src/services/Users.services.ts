import axios from 'axios';
import { hash } from 'bcryptjs';
import { envConfig } from '~/constants/Config';
import { Genders } from '~/constants/Genders';
import { Roles } from '~/constants/Roles';
import { AppDataSource } from '~/databse/data-source';
import { RefreshTokens, Users } from '~/entities';
import { signToken } from '~/utils/jwt';

class UsersServices {
    private async getOauthGoogleToken(code: string) {
        const body = {
            code,
            client_id: envConfig.GOOGLE_CLIENT_ID,
            client_secret: envConfig.GOOGLE_CLIENT_SECRET,
            redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        };

        const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return data as {
            access_token: string;
            id_token: string;
        };
    }

    private async getOauthGoogleUserInfo(access_token: string, id_token: string) {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: {
                access_token,
                alt: 'json',
            },
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });
        return data as {
            email: string;
            picture: string;
            name: string;
            verified_email: boolean;
            id: string;
        };
    }

    async oauthGoogle(code: string) {
        const { access_token, id_token } = await this.getOauthGoogleToken(code);
        const userInfo = await this.getOauthGoogleUserInfo(access_token, id_token);
        // Kiem tra email co trong databse ko
        const user = await AppDataSource.getRepository(Users).findOneBy({
            email: userInfo.email,
        });
        if (user) {
            // Co thi dang nhap
            const [access_token, refresh_token] = await Promise.all([
                signToken({
                    payload: {
                        userId: user.id,
                        role: user.role,
                    },
                    privateKey: (envConfig.ACCESS_KEY_SECRET as string) || 'accessKeySecret123',
                    options: {
                        expiresIn: (envConfig.ACCESS_TOKEN_EXPIRES_IN as string) || '15m',
                    },
                }),
                signToken({
                    payload: {
                        userId: user.id,
                        role: user.role,
                    },
                    privateKey: (envConfig.REFRESH_KEY_SECRET as string) || 'refreshKeySecret123',
                    options: {
                        expiresIn: (envConfig.REFRESH_TOKEN_EXPIRES_IN as string) || '365d',
                    },
                }),
            ]);
            const refreshToken = await AppDataSource.getRepository(RefreshTokens).findOneBy({
                userId: user.id,
            });
            if (!refreshToken) {
                await AppDataSource.getRepository(RefreshTokens).save({
                    token: refresh_token,
                    userId: user.id,
                });
            } else {
                await AppDataSource.getRepository(RefreshTokens)
                    .createQueryBuilder()
                    .update(RefreshTokens)
                    .set({
                        token: refresh_token,
                    })
                    .where('userId = :userId', { userId: user.id })
                    .execute();
            }
            return {
                access_token,
                refresh_token,
                name: user.name,
                email: user.email,
                avatar_img: user.avatar_img,
                role: Roles.USER,
                gender: user.gender,
            };
        } else {
            // Khong co thi dang ky
            const password = Math.random().toString(36).substring(2, 15);
            const hashPassword = await hash(password, 12);
            const user = await AppDataSource.getRepository(Users).save({
                email: userInfo.email,
                name: userInfo.name,
                password: hashPassword,
                gender: Genders.MALE,
            });
            const [access_token, refresh_token] = await Promise.all([
                signToken({
                    payload: {
                        userId: user.id,
                        role: Roles.USER,
                    },
                    privateKey: (envConfig.ACCESS_KEY_SECRET as string) || 'accessKeySecret123',
                    options: {
                        expiresIn: (envConfig.ACCESS_TOKEN_EXPIRES_IN as string) || '15m',
                    },
                }),
                signToken({
                    payload: {
                        userId: user.id,
                        role: Roles.USER,
                    },
                    privateKey: (envConfig.REFRESH_KEY_SECRET as string) || 'refreshKeySecret123',
                    options: {
                        expiresIn: (envConfig.REFRESH_TOKEN_EXPIRES_IN as string) || '365d',
                    },
                }),
            ]);
            await AppDataSource.getRepository(RefreshTokens).save({
                token: refresh_token,
                userId: user.id,
            });
            return {
                access_token,
                refresh_token,
                name: user.name,
                email: user.email,
                avatar_img: user.avatar_img,
                role: Roles.USER,
                gender: user.gender,
            };
        }
    }
}

const usersServices = new UsersServices();

export default usersServices;
