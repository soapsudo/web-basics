import DatabaseObject from "./database-object.js";

class Movie extends DatabaseObject{
    
    constructor(databaseUtils){
        super(databaseUtils);
    }

    getAll = async (req, res) => {
        try {
            res.json(await this.db.fetchAll(`SELECT * FROM movie`));
            
        } catch (error) {
            res.json(error.message);
        }
    }


}

export default Movie;