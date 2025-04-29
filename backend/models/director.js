import Model from './model.js'

class DirectorModel extends Model{
    
    constructor(db){
        super(db);
    }

    async getDirector(firstName, lastName) {
        
        const sql = `SELECT * FROM director WHERE first_name = '${firstName}' AND last_name = '${lastName}' LIMIT 1;`;
    
        try {
            const result = await this.db.fetchAll(sql);
    
            if (Array.isArray(result) && result.length > 0) {
                return result[0];
            } else {
                console.warn(`No director found for: ${firstName} ${lastName}, making a new entry...`);
                return null;
            }
        } catch (error) {
            throw new Error(`getDirector error: ${error.message}`);
        }
    }
    

    async insertDirector(firstName, lastName) {

        const sql = `INSERT OR REPLACE INTO director (first_name, last_name) VALUES ('${firstName}', '${lastName}');`;
    
        try {
            await this.db.execute(sql);
            const inserted = await this.getDirector(firstName, lastName);

            return inserted;

        } catch (error) {
            throw new Error(`insertDirector error: ${error.message}`);
        }
    }
}

export default DirectorModel;