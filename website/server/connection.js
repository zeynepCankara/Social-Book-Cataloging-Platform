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
            /*await this.executeQuery('USE test');
            return;*/
            await this.executeQuery('DROP DATABASE test')
        }
        
        await this.executeQuery('CREATE DATABASE test');
        await this.executeQuery('USE test');

        // TODO: Initialize database
        await this.executeQuery('CREATE TABLE User(' +
                                    'user_id INT,' +
                                    'username VARCHAR(16),' +
                                    'mail VARCHAR(32) NOT NULL,' +
                                    'name VARCHAR(16) NOT NULL,' +
                                    'password VARCHAR(32) NOT NULL,' +
                                    'usertype VARCHAR(16) NOT NULL,' +
                                    'PRIMARY KEY(user_id),' +
                                    'UNIQUE (username));');
                                    //'CONSTRAINT chk_user CHECK (usertype IN ("librarian", "user", "author")));');

        await this.executeQuery('CREATE TABLE Book(' +
                                    'book_id INT,' +
                                    'genre VARCHAR(32),' +
                                    'year INT,' +
                                    'name VARCHAR(64),' +
                                    'author_id INT,' +
                                    'PRIMARY KEY(book_id),' +
                                    'FOREIGN KEY(author_id) REFERENCES User (user_id));');

        await this.executeQuery('CREATE TABLE Challenge(' +
                                    'challenge_id INT,' +
                                    'name VARCHAR(16) NOT NULL,' +
                                    'start_date DATE NOT NULL,' +
                                    'end_date DATE NOT NULL,' +
                                    'description VARCHAR(80),' +
                                    'type VARCHAR(16),' +
                                    'creator_id INT NOT NULL,' +
                                    'winner_id INT,' +
                                    'PRIMARY KEY(challenge_id),' +
                                    'FOREIGN KEY (creator_id) REFERENCES User (user_id),' +
                                    'FOREIGN KEY (winner_id) REFERENCES User (user_id));');

        await this.executeQuery('CREATE TABLE JoinsChallenge(' +
                                    'challenge_id INT,' +
                                    'user_id INT,' +
                                    'score INT,' +
                                    'PRIMARY KEY(user_id, challenge_id),' +
                                    'FOREIGN KEY(challenge_id) REFERENCES Challenge(challenge_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');
                                     
        await this.executeQuery('CREATE TABLE Friend_of(' +
                                    'friend_id INT,' +
                                    'person_id INT,' +
                                    'status VARCHAR(16) NOT NULL,' +
                                    'PRIMARY KEY(friend_id, person_id),' +
                                    'FOREIGN KEY(friend_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(person_id) REFERENCES User(user_id));');
                                    //'CHECK (status IN (‘PENDING’, ‘ACCEPTED’, ‘REJECTED’));');

        await this.executeQuery('CREATE TABLE Post(' +
                                    'post_id INT,' +
                                    'text VARCHAR(6),' +
                                    'date DATE,' +
                                    'writer_id INT,' +
                                    'PRIMARY KEY(post_id),' +
                                    'FOREIGN KEY(writer_id) REFERENCES User(user_id));');
                                    
        await this.executeQuery('CREATE TABLE Likes(' +
                                    'post_id INT,' +
                                    'user_id INT,' +
                                    'PRIMARY KEY(post_id, user_id),' +
                                    'FOREIGN KEY(post_id) REFERENCES Post(post_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');        

        await this.executeQuery('CREATE TABLE Comments(' +
                                    'post_id INT,' +
                                    'user_id INT,' +
                                    'text VARCHAR(64),' +
                                    'PRIMARY KEY(post_id, user_id, text),' +
                                    'FOREIGN KEY(post_id) REFERENCES Post(post_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');

        await this.executeQuery('CREATE TABLE Book_List(' +
                                    'book_list_id INT,' +
                                    'name VARCHAR(32),' +
                                    'creation_date DATE,' +
                                    'description VARCHAR(64),' +
                                    'owner_id INT,' +
                                    'PRIMARY KEY(book_list_id),' +
                                    'FOREIGN KEY(owner_id) REFERENCES User(user_id));');

        await this.executeQuery('CREATE TABLE Follows(' +
                                    'user_id INT,' +
                                    'book_list_id INT,' +
                                    'PRIMARY KEY(user_id, book_list_id),' +
                                    'FOREIGN KEY(book_list_id) REFERENCES Book_List(book_list_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');

        await this.executeQuery('CREATE TABLE Contains(' +
                                    'book_list_id INT,' +
                                    'book_id INT,' +
                                    'PRIMARY KEY(book_list_id, book_id),' +
                                    'FOREIGN KEY(book_list_id) REFERENCES Book_List(book_list_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id));');

        await this.executeQuery('CREATE TABLE Edition(' +
                                    'book_id INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'page_count INT,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(book_id, number, publisher, page_count, format, language, translator),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id));');

        await this.executeQuery('CREATE TABLE Tracks(' +
                                    'user_id INT,' +
                                    'book_id INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'page_count INT,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(user_id, book_id, number, publisher, page_count, format, language, translator),' +
                                    'FOREIGN KEY(book_id, number, publisher, page_count, format, language, translator) REFERENCES Edition(book_id, number, publisher, page_count, format, language, translator),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');

        // Bu tablo sıkıntılı olablir - agregation kontrol et
        await this.executeQuery('CREATE TABLE Progress(' +
                                    'page_number INT,' +
                                    'date DATE,' +
                                    'PRIMARY KEY(page_number, date));');

        await this.executeQuery('CREATE TABLE Reviews(' +
                                    'user_id INT,' + 
                                    'book_id INT,' +
                                    'rate INT,' +
                                    'comment VARCHAR(200),' +
                                    'date DATE,' +
                                    'PRIMARY KEY(user_id, book_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id));');

        await this.executeQuery('CREATE TABLE Recommends(' +
                                    'recommendee_id INT,' +
                                    'recommender_id INT,' +
                                    'book_id INT,' +
                                    'PRIMARY KEY(recommendee_id, recommender_id, book_id),' +
                                    'FOREIGN KEY(recommendee_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(recommender_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id));');

        await this.executeQuery('CREATE TABLE Request_Change(' +
                                    'user_id INT,' +
                                    'book_id INT,' +
                                    'book_attribute VARCHAR(64),' +
                                    'new_value VARCHAR(64),' +
                                    'PRIMARY KEY(user_id, book_id, book_attribute, new_value),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id))');
                                    //'CHECK (book_attribute IN (‘genre’, ‘year’, ‘name’));');

        await this.executeQuery('CREATE TABLE Book_Serie(' +
                                    'book_serie_id INT,' +
                                    'name VARCHAR(64),' +
                                    'PRIMARY KEY(book_serie_id));');

        await this.executeQuery('CREATE TABLE Series_of(' +
                                    'book_id INT,' +
                                    'book_serie_id INT,' +
                                    'PRIMARY KEY(book_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id),' +
                                    'FOREIGN KEY(book_serie_id) REFERENCES Book_Serie(book_serie_id));');

        await this.executeQuery('CREATE TABLE Replies(' +
                                    'user_id INT,' +
                                    'book_id INT,' +
                                    'date DATE,' +
                                    'text VARCHAR(200),' +
                                    'author_id INT,' +
                                    'PRIMARY KEY(user_id, book_id, author_id),' +
                                    'FOREIGN KEY(author_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(book_id, user_id) REFERENCES Reviews(book_id, user_id));');

        await this.executeQuery('CREATE TABLE Trades(' +
                                    'offer_id INT,' +
                                    'buyer_id INT,' +
                                    'seller_id INT,' +
                                    'price REAL,' +
                                    'description VARCHAR(64),' +
                                    'book_id INT,' +
                                    'PRIMARY KEY(offer_id),' +
                                    'FOREIGN KEY(buyer_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(seller_id) REFERENCES User(user_id),' +
                                    'FOREIGN KEY(book_id) REFERENCES Book(book_id));');

        await this.executeQuery('CREATE TABLE Grup(' +
                                    'group_id INT,' +
                                    'name VARCHAR(64),' +
                                    'description VARCHAR(64),' +
                                    'is_Private INT,' +
                                    'user_id INT,' +
                                    'PRIMARY KEY(group_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');

        await this.executeQuery('CREATE TABLE JoinsGroup(' +
                                    'group_id INT,' +
                                    'user_id INT,' +
                                    'PRIMARY KEY(group_id, user_id),' +
                                    'FOREIGN KEY(group_id) REFERENCES Grup(group_id),' +
                                    'FOREIGN KEY(user_id) REFERENCES User(user_id));');

        await this.executeQuery('CREATE TABLE GroupPost(' +
                                    'post_id INT,' +
                                    'group_id INT,' +
                                    'PRIMARY KEY(post_id),' +
                                    'FOREIGN KEY(post_id) REFERENCES Post(post_id),' +
                                    'FOREIGN KEY(group_id) REFERENCES Grup(group_id));');

        await this.populateDatabase();
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