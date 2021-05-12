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
                                    'userId INT,' +
                                    'userName VARCHAR(30),' +
                                    'name VARCHAR(30),' +
                                    'mail VARCHAR(32) NOT NULL,' +
                                    'password VARCHAR(32) NOT NULL,' +
                                    'userType VARCHAR(16) NOT NULL,' +
                                    'PRIMARY KEY(userId),' +
                                    'UNIQUE (userName));');
                                    //'CONSTRAINT chk_user CHECK (usertype IN ("librarian", "user", "author")));');

        await this.executeQuery('CREATE TABLE Book(' +
                                    'bookId INT,' +
                                    'genre VARCHAR(32),' +
                                    'year INT,' +
                                    'name VARCHAR(64),' +
                                    'authorId INT,' +
                                    'authorName VARCHAR(30),' +
                                    'PRIMARY KEY(bookId),' +
                                    'FOREIGN KEY(authorId) REFERENCES User (userId));');

        await this.executeQuery('CREATE TABLE Challenge(' +
                                    'challengeId INT,' +
                                    'name VARCHAR(16) NOT NULL,' +
                                    'startDate DATE NOT NULL,' +
                                    'endDate DATE NOT NULL,' +
                                    'description VARCHAR(80),' +
                                    'type VARCHAR(16),' +
                                    'creatorId INT NOT NULL,' +
                                    'winnerId INT,' +
                                    'PRIMARY KEY(challengeId),' +
                                    'FOREIGN KEY (creatorId) REFERENCES User (userId),' +
                                    'FOREIGN KEY (winnerId) REFERENCES User (userId));');

        await this.executeQuery('CREATE TABLE JoinsChallenge(' +
                                    'challengeId INT,' +
                                    'userId INT,' +
                                    'score INT,' +
                                    'PRIMARY KEY(userId, challengeId),' +
                                    'FOREIGN KEY(challengeId) REFERENCES Challenge(challengeId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');
                                     
        await this.executeQuery('CREATE TABLE FriendOf(' +
                                    'friendId INT,' +
                                    'personId INT,' +
                                    'status VARCHAR(16) NOT NULL,' +
                                    'PRIMARY KEY(friendId, personId),' +
                                    'FOREIGN KEY(friendId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(personId) REFERENCES User(userId));');
                                    //'CHECK (status IN (‘PENDING’, ‘ACCEPTED’, ‘REJECTED’));');

        await this.executeQuery('CREATE TABLE Post(' +
                                    'postId INT,' +
                                    'text VARCHAR(6),' +
                                    'date DATE,' +
                                    'writerId INT,' +
                                    'PRIMARY KEY(postId),' +
                                    'FOREIGN KEY(writerId) REFERENCES User(userId));');
                                    
        await this.executeQuery('CREATE TABLE Likes(' +
                                    'postId INT,' +
                                    'userId INT,' +
                                    'PRIMARY KEY(postId, userId),' +
                                    'FOREIGN KEY(postId) REFERENCES Post(postId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');        

        await this.executeQuery('CREATE TABLE Comments(' +
                                    'postId INT,' +
                                    'userId INT,' +
                                    'text VARCHAR(64),' +
                                    'PRIMARY KEY(postId, userId, text),' +
                                    'FOREIGN KEY(postId) REFERENCES Post(postId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE BookList(' +
                                    'bookListId INT,' +
                                    'name VARCHAR(32),' +
                                    'creationDate DATE,' +
                                    'description VARCHAR(64),' +
                                    'ownerId INT,' +
                                    'PRIMARY KEY(bookListId),' +
                                    'FOREIGN KEY(ownerId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE Follows(' +
                                    'userId INT,' +
                                    'bookListId INT,' +
                                    'PRIMARY KEY(userId, bookListId),' +
                                    'FOREIGN KEY(bookListId) REFERENCES BookList(bookListId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE Contains(' +
                                    'bookListId INT,' +
                                    'bookId INT,' +
                                    'PRIMARY KEY(bookListId, bookId),' +
                                    'FOREIGN KEY(bookListId) REFERENCES BookList(bookListId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE Edition(' +
                                    'bookId INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'pageCount INT,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(bookId, number, publisher, pageCount, format, language, translator),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE Tracks(' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'pageCount INT,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(userId, bookId, number, publisher, pageCount, format, language, translator),' +
                                    'FOREIGN KEY(bookId, number, publisher, pageCount, format, language, translator) REFERENCES Edition(bookId, number, publisher, pageCount, format, language, translator),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE Progress(' +
                                    'pageNumber INT,' +
                                    'date DATE,' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'pageCount INT,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(pageNumber, date,userId, bookId, number, publisher, pageCount, format, language, translator),' +
                                    'FOREIGN KEY(userId, bookId, number, publisher, pageCount, format, language, translator) REFERENCES Tracks (userId, bookId, number, publisher, pageCount, format, language, translator));');

        await this.executeQuery('CREATE TABLE Reviews(' +
                                    'userId INT,' + 
                                    'bookId INT,' +
                                    'rate INT,' +
                                    'comment VARCHAR(200),' +
                                    'date DATE,' +
                                    'PRIMARY KEY(userId, bookId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE Recommends(' +
                                    'recommendeeId INT,' +
                                    'recommenderId INT,' +
                                    'bookId INT,' +
                                    'PRIMARY KEY(recommendeeId, recommenderId, bookId),' +
                                    'FOREIGN KEY(recommendeeId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(recommenderId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE RequestChange(' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'bookAttribute VARCHAR(64),' +
                                    'newValue VARCHAR(64),' +
                                    'PRIMARY KEY(userId, bookId, bookAttribute, newValue),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId))');
                                    //'CHECK (book_attribute IN (‘genre’, ‘year’, ‘name’));');
                                  

        await this.executeQuery('CREATE TABLE BookSerie(' +
                                    'bookSerieId INT,' +
                                    'name VARCHAR(64),' +
                                    'PRIMARY KEY(bookSerieId));');

        await this.executeQuery('CREATE TABLE SeriesOf(' +
                                    'bookId INT,' +
                                    'bookSerieId INT,' +
                                    'PRIMARY KEY(bookId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId),' +
                                    'FOREIGN KEY(bookSerieId) REFERENCES BookSerie(bookSerieId));');

        await this.executeQuery('CREATE TABLE Replies(' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'date DATE,' +
                                    'text VARCHAR(200),' +
                                    'authorId INT,' +
                                    'PRIMARY KEY(userId, bookId, authorId),' +
                                    'FOREIGN KEY(authorId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(bookId, userId) REFERENCES Reviews(bookId, userId));');

        await this.executeQuery('CREATE TABLE Trades(' +
                                    'offerId INT,' +
                                    'buyerId INT,' +
                                    'sellerId INT,' +
                                    'price REAL,' +
                                    'description VARCHAR(64),' +
                                    'bookId INT,' +
                                    'PRIMARY KEY(offerId),' +
                                    'FOREIGN KEY(buyerId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(sellerId) REFERENCES User(userId),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE Grup(' +
                                    'groupId INT,' +
                                    'name VARCHAR(64),' +
                                    'description VARCHAR(64),' +
                                    'isPrivate INT,' +
                                    'userId INT,' +
                                    'PRIMARY KEY(groupId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE JoinsGroup(' +
                                    'groupId INT,' +
                                    'userId INT,' +
                                    'PRIMARY KEY(groupId, userId),' +
                                    'FOREIGN KEY(groupId) REFERENCES Grup(groupId),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE GroupPost(' +
                                    'postId INT,' +
                                    'groupId INT,' +
                                    'PRIMARY KEY(postId),' +
                                    'FOREIGN KEY(postId) REFERENCES Post(postId),' +
                                    'FOREIGN KEY(groupId) REFERENCES Grup(groupId));');

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