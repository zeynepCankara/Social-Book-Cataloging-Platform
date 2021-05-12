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
                                    'text VARCHAR(64),' +
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
                                    'pageCount INT NOT NULL,' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'translator VARCHAR(64),' +
                                    'PRIMARY KEY(bookId, number, publisher, format, language),' +
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');

        await this.executeQuery('CREATE TABLE Tracks(' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'PRIMARY KEY(userId, bookId, number, publisher, format, language),' +
                                    'FOREIGN KEY(bookId, number, publisher, format, language) REFERENCES Edition(bookId, number, publisher, format, language),' +
                                    'FOREIGN KEY(userId) REFERENCES User(userId));');

        await this.executeQuery('CREATE TABLE Progress(' +
                                    'pageNumber INT,' +
                                    'date DATE,' +
                                    'userId INT,' +
                                    'bookId INT,' +
                                    'number INT,' +
                                    'publisher VARCHAR(64),' +
                                    'format VARCHAR(64),' +
                                    'language VARCHAR(64),' +
                                    'PRIMARY KEY(pageNumber, date,userId, bookId, number, publisher, format, language),' +
                                    'FOREIGN KEY(userId, bookId, number, publisher, format, language) REFERENCES Tracks (userId, bookId, number, publisher, format, language));');

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
                                    'FOREIGN KEY(bookId) REFERENCES Book(bookId));');
                                    //'CHECK (bookAttribute IN (\'genre\', \'year\', \'name\'));');
                                  
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
        // insert into User table
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (1, \'ggurbuzturk\', \'goktug gurbuzturk\', \'gg@gmail.com\', \'1234\', \'librarian\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (2, \'egesah\', \'ege sahin\', \'es@gmail.com\', \'1234\', \'user\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (3, \'jweiner\', \'Jennifer Weiner\', \'jennifer@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (4, \'anapolitano\', \'Ann Napolitano\', \'ann@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (5, \'cconaghy\', \'Charlotte McConaghy\', \'charlotte@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (6, \'vtfisher\', \'Tarryn Fisher\', \'tarryn@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (7, \'jlourey\', \'Jess Lourey\', \'jess@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (8, \'alazarre\', \'Adam Lazarre\', \'adam@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (9, \'ahoffman\', \'Alice Hoffman\', \'alice@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (10, \'bbennet\', \'Brit Bennett\', \'brit@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (11, \'jbride\', \'James McBride\', \'james@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (12, \'sclarke\', \'Susanna Clarke\', \'susanna@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (13, \'jbutcher\', \'Jim Butcher\', \'jim@gmail.com\', \'1234\', \'author\');');
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES (14, \'pbriggs\', \'Patricia Briggs\', \'patricia@gmail.com\', \'1234\', \'author\');');
    
        // insert into Book table
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (1, \'fiction\', 2020, \'Big Summer\', 3, \'Jennifer Weiner\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (2, \'fiction\', 2020, \'Dear Edward\', 4, \'Ann Napolitano\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (3, \'fiction\', 2020, \'Migrations\', 5, \'Charlotte McConaghy\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (4, \'mystery\', 2019, \'The Wives\', 6, \'Tarryn Fisher\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (5, \'mystery\', 2020, \'Unspeakable Things\', 7, \'Jess Lourey\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (6, \'mystery\', 2020, \'Blacktop Wasteland\', 8, \'Adam Lazarre\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (7, \'historical\', 2020, \'Magic Lessons\', 9, \'Alice Hoffman\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (8, \'historical\', 2020, \'The Vanishing Half\', 10, \'Brit Bennett\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (9, \'historical\', 2020, \'Deacon King Kong\', 11, \'James McBride\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (10, \'fantasy\', 2020, \'Piranesi\', 12, \'Susanna Clarke\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (11, \'fantasy\', 2020, \'Peace Talks\', 13, \'Jim Butcher\');');
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES (12, \'fantasy\', 2020, \'Smoke Bitten\', 14, \'Patricia Briggs\');');

        // insert into Challenge table
        await this.executeQuery('INSERT INTO Challenge (challengeId, name, startDate, endDate, description, type, creatorId, winnerId) VALUES (1, \'Challenge1\', \'2021-01-01\', \'2021-02-01\', \'description1\', \'reading\', 1, null);');
        await this.executeQuery('INSERT INTO Challenge (challengeId, name, startDate, endDate, description, type, creatorId, winnerId) VALUES (2, \'Challenge2\', \'2021-02-02\', \'2021-07-02\', \'description2\', \'reading\', 1, null);');

        // insert into JoinsChallenge table 
        await this.executeQuery('INSERT INTO JoinsChallenge (challengeId, userId, score) VALUES (1, 2, 100);');
        await this.executeQuery('INSERT INTO JoinsChallenge (challengeId, userId, score) VALUES (1, 6, 80);');
        await this.executeQuery('INSERT INTO JoinsChallenge (challengeId, userId, score) VALUES (2, 2, 5);');

        // insert into FriendOf table
        await this.executeQuery('INSERT INTO FriendOf (friendId, personId, status) VALUES (2, 7, \'REJECTED\');');
        await this.executeQuery('INSERT INTO FriendOf (friendId, personId, status) VALUES (10, 8, \'PENDING\');');
        
        // inser into Post table
        await this.executeQuery('INSERT INTO Post (postId, text, date, writerId) VALUES (1, \'sun\', \'2021-03-02\', 2);');
        await this.executeQuery('INSERT INTO Post (postId, text, date, writerId) VALUES (2, \'look\', \'2021-03-10\', 5);');
        await this.executeQuery('INSERT INTO Post (postId, text, date, writerId) VALUES (3, \'shine\', \'2020-08-02\', 8);');

        // insert into Likes table
        await this.executeQuery('INSERT INTO Likes (postId, userId) VALUES (1, 4);');
        await this.executeQuery('INSERT INTO Likes (postId, userId) VALUES (1, 6);');
        await this.executeQuery('INSERT INTO Likes (postId, userId) VALUES (2, 10);');
        await this.executeQuery('INSERT INTO Likes (postId, userId) VALUES (3, 2);');

        // insert into Comments Table
        await this.executeQuery('INSERT INTO Comments (postId, userId, text) VALUES (1, 5, \'Perfect\');');
        await this.executeQuery('INSERT INTO Comments (postId, userId, text) VALUES (2, 2, \'Awesome\');');
        await this.executeQuery('INSERT INTO Comments (postId, userId, text) VALUES (1, 7, \'Good choice\');');

        // insert into BookList Table
        await this.executeQuery('INSERT INTO BookList (bookListId, name, creationDate, description, ownerId) VALUES (1, \'favorite\', \'2021-01-01\', \'These are my favorites\', 2);');
        await this.executeQuery('INSERT INTO BookList (bookListId, name, creationDate, description, ownerId) VALUES (2, \'random\', \'2021-03-01\', \'These are random books\', 2);');
        
        // insert into Follows Table
        await this.executeQuery('INSERT INTO Follows (userId, bookListId) VALUES (4, 1);');
        await this.executeQuery('INSERT INTO Follows (userId, bookListId) VALUES (6, 2);');
        await this.executeQuery('INSERT INTO Follows (userId, bookListId) VALUES (13, 1);');

        // insert into Contains Table
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES (1, 3);');
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES (1, 5);');
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES (1, 7);');
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES (2, 8);');
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES (2, 10);');

        // insert into Edition Table
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (1, 1, \'Atria Books\', 254, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (2, 1, \'Dial Press\', 326, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (3, 1, \'Flatiron Books\', 186, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (3, 2, \'Macmillan Audio\', 364, \'Paperback\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (4, 1, \'Graydon House\', 382, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (5, 1, \'Thomas & Mercer\', 264, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (6, 1, \'Flatiron Books\', 238, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (7, 1, \'Orbit\', 396, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (8, 1, \'Simon Schuster\', 345, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (8, 2, \'Riverhead Books\', 343, \'Paperback\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (9, 1, \'Riverhead Books\', 371, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (10, 1, \'Bloomsbury\', 245, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (12, 1, \'Ace\', 352, \'Hardcover\', \'English\', null);');
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES (11, 1, \'Orbit\', 352, \'Hardcover\', \'English\', null);');

        
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