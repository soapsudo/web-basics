//Abstract class used for loading all of the needed database utilities (dependency injection).
class BaseController{

    constructor(databaseUtils){
        this.db = databaseUtils;
    }
    
}

export default BaseController;