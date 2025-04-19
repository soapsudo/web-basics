class DatabaseObject{

    constructor(){
        throw new Error("This class cant be instantiated!");
    }

    getAll(){}
    getOne(){}
    
    insert(){}

    update(id){}

    delete(id){}
    
}

export default DatabaseObject;