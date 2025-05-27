import Image from "../controllers/image-controller.js";

class ImageRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.image = new Image(this.databaseUtils);
    }
    /**
     * Loads the route needed for fetching images on remote URLs.
     */

    loadImageRoutes(){
        this.app.get('/get-image', this.image.getImage);  
    }

}

export default ImageRouter;