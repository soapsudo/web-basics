import BaseController from "./base-controller.js";
import fetch from 'node-fetch';
import statusCodes from "../server/status-codes.js";


class Image extends BaseController{
    constructor(databaseUtils){
        super(databaseUtils);
    }

    getImage = async(req, res) => {

        const imageUrl = req.query.url;

        if(!imageUrl) return res.status(400).json({message: 'No image URL provided'});

        try{
            const response = await fetch(imageUrl);

            if(response.status !== 200){
                
                throw{
                    status: statusCodes.SERVER_ERROR,
                    message: response.statusText
                }
            }

            const imgBuffer = await response.arrayBuffer();

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(imgBuffer);


        }catch(error){
            throw{
                status: statusCodes.SERVER_ERROR,
                message: error
            }
        }
    }
}

export default Image;