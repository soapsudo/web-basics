


class BaseController{

    constructor(databaseUtils){
        this.db = databaseUtils;
    }

    getAll(){}
    getOne(){}
    
    insert(){}

    update(id){}

    delete(id){}
    
}

export default BaseController;