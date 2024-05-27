// LandingPageController.ts
import { NextFunction, Request, Response } from 'express';
import asyncErrorHandler from '../middlewares/asyncErrorHandler';
import LandingPage from '../models/landingPage';
import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { v2 as cloudinary } from 'cloudinary';

interface CustomRequest extends Request {
    user?: {
        username: string;
        role: string;
    };
}


// GET - Retrieve landing page data
const getLandingPage = asyncErrorHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {

    const landingPage = await LandingPage.findOne();

    if (!landingPage) {

        throw new NotFoundError()
    }
    res.status(200).json(landingPage);
});

const addImage = asyncErrorHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {

    const { imageType, imageUrl, publicId } = req.body

    if (!imageType || !imageUrl || !publicId) {
        throw new BadRequestError("Image type,URL or publicId missing")
    }

    if (imageType === 'common') {
        // Add the imageUrl to the images array
        await LandingPage.updateOne({}, { $push: { images: { url: imageUrl, publicId: publicId } } }, { upsert: true });
        //await LandingPage.updateOne({}, { $addToSet: { images: imageUrl } },{ upsert: true });
    } else if (imageType === 'hero' || imageType === 'about') {
        let updateQuery = {};
        if (imageType === 'hero') {
            updateQuery = { $set: { hero: { url: imageUrl, publicId: publicId } } };
        } else if (imageType === 'about') {
            updateQuery = { $set: { 'about.image': { url: imageUrl, publicId: publicId } } };
        }
        await LandingPage.updateOne({}, updateQuery, { upsert: true });
    }


    else {
        throw new BadRequestError('Invalid image type')
    }

    res.status(200).send({ message: 'Image added successfully' });
})

const deleteImage = asyncErrorHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('d i called')
    const { imageType, imageUrl, publicId } = req.body;

    if (!imageType) {
        throw new BadRequestError("Image type missing");
    }

    if (imageType === 'common') {
        if (!imageUrl || !publicId) {
            throw new BadRequestError("Image URL or publicId missing");
        }
        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        // Delete the imageUrl from the images array
        await LandingPage.updateOne({}, { $pull: { images: { publicId: publicId } } });

    } else if (imageType === 'hero' || imageType === 'about') {

        let updateQuery = {};
        if (imageType === 'hero') {
            updateQuery = { $unset: { hero: 1 } };
        } else if (imageType === 'about') {
            updateQuery = { $unset: { 'about.image': 1 } };
        }
        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('res dele cloudinary', result)

        await LandingPage.updateOne(updateQuery);

    } else {
        throw new BadRequestError('Invalid image type');
    }



    res.status(200).send({ message: 'Image deleted successfully' });
});

//for core packages
const addCorePackage = asyncErrorHandler(async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('add package called')
    const { name, imageUrl,publicId, shortDescription } = req.body

    if (!name || !imageUrl || !publicId || !shortDescription) {
        throw new BadRequestError("Package name or image or short description is missing")
    }
    const dataToAdd = {
        name,
        image:{
            url:imageUrl,
            publicId
        },
        shortDescription
    }

    await LandingPage.updateOne({}, { $push: { corePackage: dataToAdd } }, { upsert: true });

    res.status(200).send({ message: 'core package  added successfully' });
})


export {
    getLandingPage,
    addImage,
    deleteImage,
    addCorePackage
}