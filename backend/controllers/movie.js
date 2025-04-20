import DatabaseObject from "./database-object.js";

class Movie extends DatabaseObject{
    
    constructor(databaseUtils){
        super(databaseUtils);
    }

    getAll = async (req, res) => {
        try {
            res.json(await this.db.fetchAll(`PRAGMA table_list`));
            
        } catch (error) {
            res.json(error.message);
        }
    }


}

export default Movie;