import { NextFunction, Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { Roles } from '../constants/Roles';
import dotenv from 'dotenv';
import { LoginDTO, RegisterDTO } from '../dtos/AuthDTO';
import { validate } from 'class-validator';
import { AppDataSource } from '~/databse/data-source';
import { RefreshTokens, Users } from '../entities';
import { hash, compare } from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UpdateUsersDTO } from '../dtos/UsersDTO';
import usersServices from '~/services/Users.services';
import { envConfig } from '~/constants/Config';

dotenv.config();

export class UsersController {
    async register(req: Request, res: Response): Promise<Response> {
        try {
            let registerData = req.body;

            const dto = new RegisterDTO();
            dto.email = registerData.email;
            dto.name = registerData.name;
            dto.password = registerData.password;
            dto.gender = registerData.gender;

            const errors = await validate(dto);
            if (errors && errors.length > 0) {
                return res.status(422).json({
                    msg: 'Invalid register data',
                    err: errors,
                });
            }

            registerData.password = await hash(registerData.password, 12);

            const user = await AppDataSource.getRepository(Users).save(registerData);
            if (!user) {
                return res.status(400).json({
                    msg: 'An unexpected error occurred',
                });
            }

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

            const refreshToken = await AppDataSource.getRepository(RefreshTokens).save({
                token: refresh_token,
                userId: user.id,
            });

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });

            return res.status(200).json({
                msg: 'Regiser sucessfully',
                user,
                refreshToken,
                refresh_token,
                access_token,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async oauthGoogleController(req: Request, res: Response) {
        const { code } = req.query;
        const result = await usersServices.oauthGoogle(code as string);
        const urlRedirect = `${envConfig.CLIENT_REDIRECT_URL}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&name=${result.name}&email=${result.email}&gender=${result.gender}&avatar_img=${result.avatar_img}&role=${result.role}`;
        return res.redirect(urlRedirect);
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginData = req.body;

            const dto = new LoginDTO();
            dto.email = loginData.email;
            dto.password = loginData.password;

            const errors = await validate(dto);
            if (errors && errors.length > 0) {
                return res.status(422).json({
                    msg: 'Invalid login data',
                    err: errors,
                });
            }

            const user = await AppDataSource.getRepository(Users).findOneBy({
                email: loginData.email as string,
            });
            if (!user) {
                return res.status(404).json({
                    msg: 'This user is not defined',
                });
            }

            const passwordMatches = await compare(loginData.password, user.password);
            if (!passwordMatches) {
                return res.status(401).json({
                    msg: 'This password is incorrect',
                });
            }

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

            return res.status(200).json({
                msg: 'Login succesfully',
                refresh_token: refresh_token,
                access_token: access_token,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            res.clearCookie('refresh_token');
            const { refresh_token } = req.body;
            if (!refresh_token) {
                return res.status(401).json({
                    msg: 'Refresh token is required',
                });
            }

            const repo = AppDataSource.getRepository(RefreshTokens);
            await repo.delete({
                token: refresh_token as string,
            });

            return res.status(200).json({
                msg: 'Logout successfully',
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    msg: 'Refresh token is required',
                });
            }

            const decoded = jwt.verify(
                token,
                (envConfig.REFRESH_KEY_SECRET as string) || 'refreshKeySecret123',
            ) as JwtPayload;
            const access_token = await signToken({
                payload: {
                    userId: decoded.userId,
                    role: decoded.role,
                },
                privateKey: (envConfig.ACCESS_KEY_SECRET as string) || 'accessKeySecret123',
                options: {
                    expiresIn: (envConfig.ACCESS_TOKEN_EXPIRES_IN as string) || '15m',
                },
            });

            return res.status(200).json({
                msg: 'Get new access token successfully',
                accessToken: access_token,
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params;

            const user = await AppDataSource.getRepository(Users)
                .createQueryBuilder('users')
                .where('users.id = :id', { id })
                .getOne();
            if (!user) {
                return res.status(404).json({
                    msg: 'Cant not found this user',
                });
            }

            return res.status(200).json({
                msg: 'Get user successfully',
                data: user,
            });
        } catch (error) {
            throw new Error();
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            let updateUserData = req.body;
            let { id } = req.params;

            const updateUserDto = new UpdateUsersDTO();
            updateUserDto.name = updateUserData.name;
            updateUserDto.gender = updateUserData.gender;

            const errors = await validate(updateUserDto);
            if (errors && errors.length > 0) {
                return res.status(422).json({
                    msg: 'Invalid data',
                    err: errors,
                });
            }

            const user = await AppDataSource.getRepository(Users)
                .createQueryBuilder('users')
                .update(Users)
                .set({
                    name: updateUserData.name,
                    gender: updateUserData.gender,
                })
                .where('id = :id', { id })
                .execute();

            if (!user) {
                return res.status(404).json({
                    msg: 'Cant not update this user',
                });
            }

            return res.status(200).json({
                msg: 'Update user successfully',
                data: user,
            });
        } catch (error) {
            throw new Error();
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const changePasswordData = req.body;
            const { user_id } = req.params;

            const user = await AppDataSource.getRepository(Users).findOneBy({
                id: user_id,
            });
            if (!user) {
                return res.status(404).json({
                    msg: 'This user is not defined',
                });
            }
            const passwordMatches = await compare(changePasswordData.old_password, user.password);
            if (!passwordMatches) {
                return res.status(401).json({
                    msg: 'This password is incorrect',
                });
            }

            const hashedPassword = await hash(changePasswordData.password, 12);

            const data = await AppDataSource.getRepository(Users)
                .createQueryBuilder('users')
                .update(Users)
                .set({
                    password: hashedPassword,
                })
                .where('id = :id', { id: user_id })
                .execute();

            return res.status(200).json({
                msg: 'Update user successfully',
                data: data,
            });
        } catch (error) {
            throw new Error();
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { user_id } = req.params;
        const { password } = req.body;
        const hashedPassword = await hash(password, 12);
        const data = await AppDataSource.getRepository(Users)
            .createQueryBuilder('users')
            .update(Users)
            .set({
                password: hashedPassword,
            })
            .where('id = :id', { id: user_id })
            .execute();
        return res.status(200).json({
            msg: 'Reset successfully',
            data: data,
        });
    }
}
