import sqlite3 from 'sqlite3';
import { initialQuery } from './initial-queries.js';

class DatabaseUtils {

    static db;

    constructor(rootDirectory) {
        
        this.filepath = rootDirectory + '/database.sqlite';

        if(!DatabaseUtils.db){
            DatabaseUtils.db = this.initialiseDatabase(this.filepath);
        }

        this.db = DatabaseUtils.db;

        this.createTables();

    }

    initialiseDatabase(filepath) {

        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                console.log(error.message);
            }
        });

        console.log("Database connection established!");
        return db;
        
    }

    async createTables() {
        try{
            await this.execute(initialQuery);
        }catch(error){
            console.log(error);
        }    
    }

    /**
     * Alle query wrappers zijn gevonden op https://www.sqlitetutorial.net/sqlite-nodejs
     */
    fetchAll(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    fetchFirst(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    execute(sql, params = []) {
        if (params && params.length > 0) {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.db.exec(sql, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }
}

export default DatabaseUtils;