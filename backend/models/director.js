import Model from './model.js'

class DirectorModel extends Model{
    
    constructor(db){
        super(db);
    }

    async getDirector(firstName, lastName) {
        
        const sql = `SELECT * FROM director WHERE first_name = ? AND last_name = ? LIMIT 1;`;
    
        try {
            const result = await this.db.fetchAll(sql, [firstName, lastName]);
    
            if (Array.isArray(result) && result.length > 0) {
                return result[0];
            } else {
                console.warn('No director found for:', firstName, lastName);
                return null;
            }
        } catch (error) {
            console.error('getDirector error:', error);
            return null;
        }
    }
    

    async insertDirector(firstName, lastName) {

        const sql = `INSERT OR REPLACE INTO director (first_name, last_name) VALUES (?, ?);`;
    
        try {
            await this.db.execute(sql, [firstName, lastName]);
            const inserted = await this.getDirector(firstName, lastName);

            return inserted;

        } catch (error) {
            console.error('insertDirector error:', error);
            return null;
        }
    }
}

export default DirectorModel;