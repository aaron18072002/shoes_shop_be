import fs from 'fs';
import { UPLOAD_IMAGES_DIR, UPLOAD_IMAGES_TEMP_DIR } from '../constants/dir';
import { Request } from 'express';
import formidable, { File } from 'formidable';

export const initFolderUpload = () => {
    if (!fs.existsSync(UPLOAD_IMAGES_TEMP_DIR)) {
        fs.mkdirSync(UPLOAD_IMAGES_TEMP_DIR, {
            recursive: true, // cho phép tạo folder nested
        });
    }
};

export const handleUploadImages = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGES_TEMP_DIR, // chon folder chứa ảnh
        maxFiles: 6,
        keepExtensions: true,
        maxFileSize: 300 * 1024, // 300KB
        maxTotalFileSize: 300 * 1024 * 6,
        filter: function ({ name, originalFilename, mimetype }) {
            const valid = name === 'images' && !!mimetype?.includes('image');
            if (!valid) {
                form.emit('error' as any, new Error('File is invalid') as any);
            }
            return valid;
        },
    });
    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, field, files) => {
            if (err) {
                return reject(err);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            if (!Boolean(files.images)) {
                // images ở đây là req.images
                return reject(new Error('File is empty'));
            }
            resolve(files.images as File[]);
        });
    });
};
