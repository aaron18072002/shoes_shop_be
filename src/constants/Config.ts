import { config } from 'dotenv';
import argv from 'minimist';

const options = argv(process.argv.slice(2));
console.log(options);

export const isProduction = Boolean(options.production);

config({
    path: isProduction ? '.env.production' : '.env',
});

console.log(isProduction);

export const envConfig = {
    APP_PORT: process.env.APP_PORT || 8000,
    HOST: process.env.HOST as string,

    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: process.env.DB_PORT as string,
    DB_USERNAME: process.env.DB_USERNAME as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_DATABASE: process.env.DB_DATABASE as string,

    ACCESS_KEY_SECRET: process.env.ACCESS_KEY_SECRET as string,
    REFRESH_KEY_SECRET: process.env.REFRESH_KEY_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,

    EMAIL_USERNAME: process.env.EMAIL_USERNAME as string,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,

    URL_FE: process.env.URL_FE as string,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
    CLIENT_REDIRECT_URL: process.env.CLIENT_REDIRECT_URL as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
};
