import mysql from 'mysql';
import { host, user, password } from './credentials.js';

class Connection {
    constructor() {
        const connection = mysql.createConnection({
            host,
            user,
            password
        })
        
        connection.connect(function (err) {
            if (err) {
                console.error(err.stack);
            }
        });

        this.connection = connection;
    }

    async initDatabase() {
        let alreadyInitialized;
        const results = await this.executeQuery('SHOW DATABASES');
        alreadyInitialized = results.some(e => e.Database === 'test');
        
        if (alreadyInitialized) { 
            await this.executeQuery('USE test');
            return;
        }
        
        await this.executeQuery('CREATE DATABASE test');
        await this.executeQuery('USE test');

        // TODO: Initialize database
        // await this.executeQuery('CREATE TABLE ...')

        await populateDatabase();
    }
    
    async populateDatabase() {
        // TODO: Populate database
        // await this.executeQuery('INSERT INTO ...');
    }


    async executeQuery(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }
}

export default Connection;