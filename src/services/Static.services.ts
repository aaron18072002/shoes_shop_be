import { Request } from 'express';
import { handleUploadImages } from '../utils/file';
import sharp from 'sharp';
import { UPLOAD_IMAGES_DIR } from '~/constants/dir';
import fs from 'fs';

class StaticServices {
    async uploadImages(req: Request) {
        const files = await handleUploadImages(req);
        const result = await Promise.all(
            files.map(async (file) => {
                await sharp(file.filepath)
                    // .unflatten()
                    // .jpeg()
                    .toFile(`${UPLOAD_IMAGES_DIR}\\${file.newFilename.split('.')[0]}.png`);
                fs.unlinkSync(file.filepath);
                return file.newFilename.split('.')[0];
            }),
        );
        // const resut = await Promise.all(
        //     files.map((file) => {
        //         return file.newFilename.split('.')[0];
        //     }),
        // );
        return result;
    }
}

const staticServies = new StaticServices();

export default staticServies;
