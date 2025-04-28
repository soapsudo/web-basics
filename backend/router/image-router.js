import Image from "../controllers/image.js";

class ImageRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.image = new Image(this.databaseUtils);
    }

    loadImageRoutes(){
        this.app.get('/get-image', this.image.getImage);  
    }

}

export default ImageRouter;