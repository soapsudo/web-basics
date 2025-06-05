import Model from './model.js'

class DirectorModel extends Model{
    
    constructor(db){
        super(db);
    }


    /**
     * Gets the data of a director entity record saved in the database, based on the given first name and last name.
     * If the record doesn't exist, it gets inserted into the database.
     * 
     * @param {*} firstName - Director's first name. 
     * @param {*} lastName - Director's last name.
     * @returns Director data in a JSON object OR an error if the query didn't go through.
     */
    async getDirector(firstName, lastName) {
        
        const sql = `SELECT * FROM director WHERE first_name = ? AND last_name = ? LIMIT 1;`;
    
        try {
            const result = await this.db.fetchAll(sql, [firstName, lastName]);
    
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
    
     /**
     * Inserts a new director record into the database, using the given first name and last name.
     * 
     * @param {*} firstName - Director's first name. 
     * @param {*} lastName - Director's last name.
     * @returns Director data in a JSON object OR an error if the query didn't go through.
     */
    async insertDirector(firstName, lastName) {

        const sql = `INSERT OR REPLACE INTO director (first_name, last_name) VALUES (?, ?);`;
    
        try {
            await this.db.execute(sql, [firstName, lastName]);
            const inserted = await this.getDirector(firstName, lastName);

            return inserted;

        } catch (error) {
            throw new Error(`insertDirector error: ${error.message}`);
        }
    }
}

export default DirectorModel;