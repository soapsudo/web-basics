import BaseController from "./base-controller.js";
import fetch from 'node-fetch';
import statusCodes from "../server/status-codes.js";


class Image extends BaseController{
    constructor(databaseUtils){
        super(databaseUtils);
    }

    /**
     * Gets an image from the remote resource.
     * 
     * @param {*} req - Request from the middleware. 
     * @param {*} res - Response to be sent.
     * @param {*} next - Callback function to the global error handler.
     * @returns Image in the file format OR an error if the request didn't go through.
     */
    getImage = async(req, res, next) => {

        const imageUrl = req.query.url;

        if(!imageUrl){
            return next({
                status: statusCodes.BAD_REQUEST,
                message: 'No image URL provided.'
            });
        } 

        try{
            const response = await fetch(imageUrl);

            if(response.status !== 200){
                return next({
                    status: statusCodes.SERVER_ERROR,
                    message: response.statusText
                });
            }

            const imgBuffer = await response.arrayBuffer();

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(imgBuffer);


        }catch(error){
            return next({
                status: statusCodes.SERVER_ERROR,
                message: error
            });
        }
    }
}

export default Image;