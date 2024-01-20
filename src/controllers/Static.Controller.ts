import { NextFunction, Request, Response } from 'express';
import staticServies from '../services/Static.services';
import path from 'path';
import { UPLOAD_IMAGES_DIR } from '~/constants/dir';

export const uploadImagesController = async (req: Request, res: Response, next: NextFunction) => {
    const result = await staticServies.uploadImages(req);
    return res.status(200).json({
        msg: 'Upload images success',
        data: result,
    });
};

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    console.log(path.join(UPLOAD_IMAGES_DIR, name + '.png'));
    return res.sendFile(path.join(UPLOAD_IMAGES_DIR, name + '.png'), (err) => {
        if (err) {
            return res.status(404).json({
                msg: 'Image not found',
                err,
            });
        }
    });
};
