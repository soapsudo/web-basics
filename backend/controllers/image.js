import BaseController from "./base-controller.js";
import fetch from 'node-fetch';

class Image extends BaseController{
    constructor(databaseUtils){
        super(databaseUtils);
    }

    getImage = async(req, res) => {

        const imageUrl = req.query.url;

        if(!imageUrl) return res.status(400).json({message: 'No image URL provided'});

        try{
            const response = await fetch(imageUrl);

            if(response.status !== 200) return res.status(500).json(response.statusText);

            const imgBuffer = await response.buffer();

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(imgBuffer);


        }catch(error){
            return res.status(500).json({message: error.message});
        }
    }
}

export default Image;