import sqlite3 from 'sqlite3';
import { initialQuery, insertDummyData } from './initial-queries.js';

class DatabaseUtils {

    static db;

    //Initializes a new database if it doesn't exist via a static singleton. Creates tables.
    constructor(rootDirectory) {
        
        this.filepath = rootDirectory + '/database.sqlite';

        if(!DatabaseUtils.db){
            DatabaseUtils.db = this.initialiseDatabase(this.filepath);
        }

        this.db = DatabaseUtils.db;

        this.createTables();

    }

    /**
     * Makes a new sqlite database in the given directory.
     * 
     * @param {*} filepath - File path where the new database needs to be made. 
     * @returns Void.
     */
    initialiseDatabase(filepath) {

        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                console.log(error.message);
            }
        });

        console.log("Database connection established!");
        return db;
        
    }

    /**
     * Executes create queries needed for the business logic of the app.
     * 
     * @param {*} filepath - File path where the new database needs to be made. 
     * @returns Void OR logs an error if the queries couldn't be executed.
     */
    async createTables() {
        try{
            await this.execute(initialQuery);
            await insertDummyData(this);
        }catch(error){
            console.log(error.message);
        }    
    }

    /**
     * Query wrappers for executing basic operations on the sqlite database.
     * Source: https://www.sqlitetutorial.net/sqlite-nodejs
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