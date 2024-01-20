import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { AppDataSource } from './databse/data-source';
import { initFolderUpload } from './utils/file';
import { envConfig } from './constants/Config';

// Tạo folder upload/images nếu chưa tạo
initFolderUpload();

const PORT = envConfig.APP_PORT;

AppDataSource.initialize()
    .then(async () => {
        console.log('Connect database success');
    })
    .catch((error: any) => console.log(error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
