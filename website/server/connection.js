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

        //STORED PROCEDURES
        await this.executeQuery('CREATE PROCEDURE getAchievementInfo(IN specifiedUserId INT) BEGIN SELECT name,achieved FROM JoinsChallenge NATURAL JOIN Challenge WHERE  ((userId = specifiedUserId) AND (achieved IS NOT NULL)); END');
        await this.executeQuery('CREATE PROCEDURE indicateAchievement(IN specifiedChallengeId INT) BEGIN UPDATE JoinsChallenge SET achieved = 1 WHERE (score >= (SELECT bookCount FROM Challenge WHERE challengeId = specifiedChallengeId)) AND (challengeId = specifiedChallengeId); UPDATE JoinsChallenge SET achieved = 0 WHERE (score < (SELECT bookCount FROM Challenge WHERE challengeId = specifiedChallengeId)) AND (challengeId = specifiedChallengeId); END ');

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
                                    'bookCount INT NOT NULL,' +
                                    'PRIMARY KEY(challengeId),' +
                                    'FOREIGN KEY (creatorId) REFERENCES User (userId));');

        await this.executeQuery('CREATE TABLE JoinsChallenge(' +
                                    'challengeId INT,' +
                                    'userId INT,' +
                                    'score INT,' +
                                    'achieved INT,' +
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
                                    'text VARCHAR(200),' +
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

        //TRIGGERS
        await this.executeQuery('CREATE TRIGGER challengeDateChk AFTER INSERT ON Challenge FOR EACH ROW BEGIN IF NEW.startDate > NEW.endDate THEN DELETE FROM challenge WHERE challengeId = NEW.challengeId; END IF; END;');


        await this.populateDatabase();
    }

    async populateDatabase() {
        // insert into User table
        await this.executeQuery('INSERT INTO user (userId, userName, name, mail, password, userType) VALUES' +
                                    '(1, \'ggurbuzturk\', \'goktug gurbuzturk\', \'gg@gmail.com\', \'1234\', \'LIBRARIAN\'),' +
                                    '(2, \'egesah\', \'ege sahin\', \'es@gmail.com\', \'1234\', \'USER\'),' +
                                    '(16, \'hallac\', \'ahmet feyzi halac\', \'afh@gmail.com\', \'1234\', \'USER\'),' +
                                    '(3, \'jweiner\', \'Jennifer Weiner\', \'jennifer@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(4, \'anapolitano\', \'Ann Napolitano\', \'ann@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(5, \'cconaghy\', \'Charlotte McConaghy\', \'charlotte@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(6, \'vtfisher\', \'Tarryn Fisher\', \'tarryn@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(7, \'jlourey\', \'Jess Lourey\', \'jess@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(8, \'alazarre\', \'Adam Lazarre\', \'adam@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(9, \'ahoffman\', \'Alice Hoffman\', \'alice@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(10, \'bbennet\', \'Brit Bennett\', \'brit@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(11, \'jbride\', \'James McBride\', \'james@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(12, \'sclarke\', \'Susanna Clarke\', \'susanna@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(13, \'jbutcher\', \'Jim Butcher\', \'jim@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(14, \'pbriggs\', \'Patricia Briggs\', \'patricia@gmail.com\', \'1234\', \'AUTHOR\'),' +
                                    '(15, \'jkrowling\', \'J.K. Rowling\', \'rowling@gmail.com\', \'1234\', \'AUTHOR\');');

        // insert into Book table -> BURAYA BIR EKLEME YAPILIRKEN EDITION'A DA YAPILMALI BUNUN ICIN TRIGGER OLABILIR
        await this.executeQuery('INSERT INTO Book (bookId, genre, year, name, authorId, authorName) VALUES' +
                                    '(1, \'fiction\', 2020, \'Big Summer\', 3, \'Jennifer Weiner\'),' +
                                    '(2, \'fiction\', 2020, \'Dear Edward\', 4, \'Ann Napolitano\'),' +
                                    '(3, \'fiction\', 2020, \'Migrations\', 5, \'Charlotte McConaghy\'),' +
                                    '(4, \'mystery\', 2019, \'The Wives\', 6, \'Tarryn Fisher\'),' +
                                    '(5, \'mystery\', 2020, \'Unspeakable Things\', 7, \'Jess Lourey\'),' +
                                    '(6, \'mystery\', 2020, \'Blacktop Wasteland\', 8, \'Adam Lazarre\'),' +
                                    '(7, \'historical\', 2020, \'Magic Lessons\', 9, \'Alice Hoffman\'),' +
                                    '(8, \'historical\', 2020, \'The Vanishing Half\', 10, \'Brit Bennett\'),' +
                                    '(9, \'historical\', 2020, \'Deacon King Kong\', 11, \'James McBride\'),' +
                                    '(10, \'fantasy\', 2020, \'Piranesi\', 12, \'Susanna Clarke\'),' +
                                    '(11, \'fantasy\', 2020, \'Peace Talks\', 13, \'Jim Butcher\'),' +
                                    '(12, \'fantasy\', 2020, \'Smoke Bitten\', 14, \'Patricia Briggs\'),' +
                                    '(13, \'fantasy\', 2003, \'Harry Potter and the Sorcerers Stone\', 15, \'J.K. Rowling\'),' +
                                    '(14, \'fantasy\', 1999, \'Harry Potter and the Chamber of Secrets\', 15, \'J.K. Rowling\'),' +
                                    '(15, \'fantasy\', 2004, \'Harry Potter and the Prisoner of Azkaban\', 15, \'J.K. Rowling\');');

        // insert into Challenge table -> GOODREADS'DEN BAK CHALLENGE'DA BASKALARIYLA YARISTIRMIYOR
        await this.executeQuery('INSERT INTO Challenge (challengeId, name, startDate, endDate, description, type, creatorId, bookCount) VALUES' +
                                    '(1, \'Challenge1\', \'2021-01-01\', \'2021-02-01\', \'description1\', \'reading\', 1, 20),' +
                                    '(2, \'Challenge2\', \'2021-02-02\', \'2021-07-02\', \'description2\', \'reading\', 1, 40),' +
                                    '(3, \'Challenge3\', \'2021-02-01\', \'2021-08-02\', \'summer challenge\', \'reading\', 1, 50),' +
                                    '(4, \'Challenge4\', \'2021-02-02\', \'2021-03-02\', \'summer challenge2\', \'reading\', 1, 50),' +
                                    '(5, \'Challenge5\', \'2021-02-03\', \'2021-08-02\', \'summer challenge3\', \'reading\', 1, 50),' +
                                    '(6, \'Challenge6\', \'2021-02-04\', \'2021-04-02\', \'medium level\', \'reading\', 1, 70),' +
                                    '(7, \'Challenge7\', \'2021-02-05\', \'2021-08-02\', \'medium level\', \'reading\', 1, 80),' +
                                    '(8, \'Challenge8\', \'2021-02-06\', \'2021-04-10\', \'medium level\', \'reading\', 1, 80),' +
                                    '(9, \'Challenge9\', \'2021-02-07\', \'2021-05-02\', \'hard level\', \'reading\', 1, 120),' +
                                    '(10, \'Challenge10\', \'2021-02-08\', \'2021-08-02\', \'hard level\', \'reading\', 1, 130);');

        // insert into JoinsChallenge table
        await this.executeQuery('INSERT INTO JoinsChallenge (challengeId, userId, score, achieved) VALUES' +
                                    '(1, 2, 100, 1),' +
                                    '(1, 6, 80, 1),' +
                                    '(2, 1, 10, null),' +
                                    '(2, 2, 5, null),' +
                                    '(2, 3, 12, null),' +
                                    '(2, 4, 13, null),' +
                                    '(2, 5, 14, null),' +
                                    '(2, 6, 15, null),' +
                                    '(2, 7, 16, null),' +
                                    '(2, 8, 17, null),' +
                                    '(2, 9, 18, null),' +
                                    '(2, 10, 19, null),' +
                                    '(2, 11, 20, null),' +
                                    '(2, 13, 25, null),' +
                                    '(2, 12, 11, null),' +
                                    '(3, 3, 34, null),' +
                                    '(3, 4, 45, null),' +
                                    '(4, 2, 54, 1),' +
                                    '(4, 7, 32, 0),' +
                                    '(4, 8, 12, 0),' +
                                    '(3, 9, 75, null),' +
                                    '(5, 10, 56, null),' +
                                    '(5, 11, 45, null),' +
                                    '(6, 2, 72, 1),' +
                                    '(7, 2, 67, null),' +
                                    '(8, 2, 75, 0),' +
                                    '(9, 2, 98, 0),' +
                                    '(10, 5, 78, null),' +
                                    '(10, 6, 99, null),' +
                                    '(10, 7, 56, null),' +
                                    '(10, 8, 67, null),' +
                                    '(10, 9, 78, null),' +
                                    '(10, 10, 56, null),' +
                                    '(10, 11, 97, null),' +
                                    '(10, 12, 67, null),' +
                                    '(10, 13, 87, null);');

        // insert into FriendOf table
        await this.executeQuery('INSERT INTO FriendOf (friendId, personId, status) VALUES' +
                                    '(2, 7, \'REJECTED\'),' +
                                    '(10, 8, \'PENDING\');');

        // inser into Post table
        await this.executeQuery('INSERT INTO Post (postId, text, date, writerId) VALUES' +
                                    '(1, \'sun\', \'2021-03-02\', 2),' +
                                    '(2, \'look\', \'2021-03-10\', 3),' +
                                    '(3, \'shine\', \'2020-08-02\', 4),' +
                                    '(4, \'good luck all in new challenge\', \'2021-04-02\', 1),' +
                                    '(5, \'nice book this is\', \'2021-03-04\', 5),' +
                                    '(9, \'ZZZ\', \'2021-03-04\', 6),' +
                                    '(6, \'good day\', \'2021-03-05\', 7),' +
                                    '(10, \'Hello my friends\', \'2021-03-06\', 10),' +
                                    '(11, \'Hello all\', \'2021-03-06\', 11),' +
                                    '(12, \'Empty post\', \'2021-03-06\', 12),' +
                                    '(13, \'I wrote a new book\', \'2021-03-06\', 13),' +
                                    '(14, \'My book is published\', \'2021-03-06\', 14),' +
                                    '(15, \'sunshine\', \'2021-03-06\', 15),' +
                                    '(7, \'Hello librarian goktug\', \'2021-03-06\', 8),' +
                                    '(8, \'funny post\', \'2021-03-010\', 9);');

        // insert into Likes table
        await this.executeQuery('INSERT INTO Likes (postId, userId) VALUES' +
                                    '(1, 15),' +
                                    '(1, 6),' +
                                    '(4, 2),' +
                                    '(5, 3),' +
                                    '(6, 4),' +
                                    '(7, 1),' +
                                    '(8, 5),' +
                                    '(9, 6),' +
                                    '(10, 7),' +
                                    '(11, 8),' +
                                    '(12, 9),' +
                                    '(13, 10),' +
                                    '(14, 11),' +
                                    '(15, 12),' +
                                    '(2, 13),' +
                                    '(3, 14);');

        // insert into Comments Table
        await this.executeQuery('INSERT INTO Comments (postId, userId, text) VALUES' +
                                    '(1, 5, \'Perfect\'),' +
                                    '(2, 2, \'Awesome\'),' +
                                    '(1, 7, \'Good choice\');');

        // insert into BookList Table
        await this.executeQuery('INSERT INTO BookList (bookListId, name, creationDate, description, ownerId) VALUES' +
                                    '(1, \'favorite\', \'2021-01-01\', \'These are my favorites\', 2),' +
                                    '(2, \'random\', \'2021-03-01\', \'These are random books\', 2);');

        // insert into Follows Table
        await this.executeQuery('INSERT INTO Follows (userId, bookListId) VALUES' +
                                    '(4, 1),' +
                                    '(6, 2),' +
                                    '(1, 1),' +
                                    '(3, 1),' +
                                    '(7, 1),' +
                                    '(5, 1),' +
                                    '(8, 1),' +
                                    '(9, 1),' +
                                    '(10, 1),' +
                                    '(11, 1),' +
                                    '(12, 1),' +
                                    '(14, 1),' +
                                    '(15, 1),' +
                                    '(13, 1);');

        // insert into Contains Table
        await this.executeQuery('INSERT INTO Contains (bookListId, bookId) VALUES' +
                                    '(1, 3),' +
                                    '(1, 5),' +
                                    '(1, 7),' +
                                    '(2, 8),' +
                                    '(1, 1),' +
                                    '(1, 2),' +
                                    '(1, 4),' +
                                    '(1, 6),' +
                                    '(1, 8),' +
                                    '(1, 9),' +
                                    '(1, 11),' +
                                    '(1, 12),' +
                                    '(1, 13),' +
                                    '(2, 1),' +
                                    '(2, 2),' +
                                    '(2, 3),' +
                                    '(2, 4),' +
                                    '(2, 15),' +
                                    '(2, 14),' +
                                    '(2, 13),' +
                                    '(2, 10);');

        // insert into Edition Table
        await this.executeQuery('INSERT INTO Edition (bookId, number, publisher, pageCount, format, language, translator) VALUES' +
                                    '(1, 1, \'Atria Books\', 254, \'Hardcover\', \'English\', null),' +
                                    '(1, 2, \'Dial Press\', 234, \'Hardcover\', \'English\', null),' +
                                    '(2, 1, \'Dial Press\', 326, \'Hardcover\', \'English\', null),' +
                                    '(3, 1, \'Flatiron Books\', 186, \'Hardcover\', \'English\', null),' +
                                    '(3, 2, \'Macmillan Audio\', 364, \'Paperback\', \'English\', null),' +
                                    '(4, 1, \'Graydon House\', 382, \'Hardcover\', \'English\', null),' +
                                    '(5, 1, \'Thomas & Mercer\', 264, \'Hardcover\', \'English\', null),' +
                                    '(6, 1, \'Flatiron Books\', 238, \'Hardcover\', \'English\', null),' +
                                    '(7, 1, \'Orbit\', 396, \'Hardcover\', \'English\', null),' +
                                    '(8, 1, \'Simon Schuster\', 345, \'Hardcover\', \'English\', null),' +
                                    '(8, 2, \'Riverhead Books\', 343, \'Paperback\', \'English\', null),' +
                                    '(9, 1, \'Riverhead Books\', 371, \'Hardcover\', \'English\', null),' +
                                    '(10, 1, \'Bloomsbury\', 245, \'Hardcover\', \'English\', null),' +
                                    '(11, 1, \'Orbit\', 352, \'Hardcover\', \'English\', null),' +
                                    '(12, 1, \'Ace\', 352, \'Hardcover\', \'English\', null),' +
                                    '(13, 1, \'Scholastic Inc\', 309, \'Hardcover\', \'English\', null),' +
                                    '(14, 1, \'Pottermore Publishing\', 341, \'Hardcover\', \'English\', null),' +
                                    '(15, 1, \'Scholastic Inc\', 435, \'Hardcover\', \'English\', null);');

        // insert into Tracks Table
        await this.executeQuery('INSERT INTO Tracks (userId, bookId, number, publisher, format, language) VALUES' +
                                    '(2, 1, 1, \'Atria Books\', \'Hardcover\', \'English\'),' +
                                    '(2, 5, 1, \'Thomas & Mercer\', \'Hardcover\', \'English\'),' +
                                    '(5, 2, 1, \'Dial Press\', \'Hardcover\', \'English\'),' +
                                    '(6, 1, 1, \'Atria Books\', \'Hardcover\', \'English\'),' +
                                    '(7, 1, 1, \'Atria Books\', \'Hardcover\', \'English\'),' +
                                    '(3, 1, 2, \'Dial Press\', \'Hardcover\', \'English\'),' +
                                    '(4, 1, 2, \'Dial Press\', \'Hardcover\', \'English\'),' +
                                    '(5, 1, 2, \'Dial Press\', \'Hardcover\', \'English\'),' +
                                    '(7, 8, 2, \'Riverhead Books\', \'Paperback\', \'English\'),' +
                                    '(2, 3, 1, \'Flatiron Books\', \'Hardcover\', \'English\'),' +
                                    '(3, 3, 2, \'Macmillan Audio\', \'Paperback\', \'English\'),' +
                                    '(4, 4, 1, \'Graydon House\', \'Hardcover\', \'English\'),' +
                                    '(5, 5, 1, \'Thomas & Mercer\', \'Hardcover\', \'English\'),' +
                                    '(6, 6, 1, \'Flatiron Books\', \'Hardcover\', \'English\'),' +
                                    '(7, 7, 1, \'Orbit\', \'Hardcover\', \'English\'),' +
                                    '(8, 8, 1, \'Simon Schuster\', \'Hardcover\', \'English\'),' +
                                    '(9, 8, 2, \'Riverhead Books\', \'Paperback\', \'English\'),' +
                                    '(10, 9, 1, \'Riverhead Books\', \'Hardcover\', \'English\'),' +
                                    '(11, 10, 1, \'Bloomsbury\', \'Hardcover\', \'English\'),' +
                                    '(12, 11, 1, \'Orbit\', \'Hardcover\', \'English\'),' +
                                    '(13, 12, 1, \'Ace\', \'Hardcover\', \'English\'),' +
                                    '(14, 13, 1, \'Scholastic Inc\', \'Hardcover\', \'English\'),' +
                                    '(15, 14, 1, \'Pottermore Publishing\', \'Hardcover\', \'English\'),' +
                                    '(14, 15, 1, \'Scholastic Inc\', \'Hardcover\', \'English\'),' +
                                    '(13, 7, 1, \'Orbit\', \'Hardcover\', \'English\'),' +
                                    '(12, 8, 1, \'Simon Schuster\', \'Hardcover\', \'English\'),' +
                                    '(12, 8, 2, \'Riverhead Books\', \'Paperback\', \'English\'),' +
                                    '(9, 10, 1, \'Bloomsbury\', \'Hardcover\', \'English\'),' +
                                    '(8, 12, 1, \'Ace\', \'Hardcover\', \'English\');');

        // Insert into Progress Table
        await this.executeQuery('INSERT INTO Progress (pageNumber, date, userId, bookId, number, publisher, format, language) VALUES' +
                                    '(25, \'2021-02-05\', 2, 1, 1, \'Atria Books\', \'Hardcover\', \'English\'),' +
                                    '(50, \'2021-02-07\', 2, 1, 1, \'Atria Books\', \'Hardcover\', \'English\'),' +
                                    '(100, \'2021-03-10\', 5, 2, 1, \'Dial Press\', \'Hardcover\', \'English\'),' +
                                    '(160, \'2021-03-15\', 7, 8, 2, \'Riverhead Books\', \'Paperback\', \'English\');');

        // Insert into Reviews
        await this.executeQuery('INSERT INTO Reviews (userId, bookId, rate, comment, date) VALUES' +
                                    '(2, 1, 4, \'It was a very gripping book.\', \'2021-04-10\'),' +
                                    '(5, 2, 2, \'There are contradictory statements in the book.\', \'2021-04-20\'),' +
                                    '(5, 13, 2, \'Ehh\', \'2021-07-20\'),' +
                                    '(6, 13, 5, \'Love\', \'2021-01-20\'),' +
                                    '(7, 13, 0, \'Hate\', \'2021-04-09\'),' +
                                    '(15, 1, 4, \'Selamun Aleykum\', \'2021-04-09\'),' +
                                    '(7, 8, 3, \'I strongly recommend everyone to read it. It broadened my perspective.\', \'2021-05-03\');');

        //Insert into Recommends
        await this.executeQuery('INSERT INTO test.Recommends (recommendeeId, recommenderId, bookId) VALUES' +
                                    '(2, 3, 1),' +
                                    '(2, 8, 1),' +
                                    '(5, 14, 2);');

        //Insert into Request Change -> HATALI OLABILIR TYPE'DA SIKINTI VAR GIBI TEKRAR KONTROL ET
        await this.executeQuery('INSERT INTO RequestChange (userId, bookId, bookAttribute, newValue) VALUES' +
                                    '(2, 1, \'genre\', \'mystery\'),' +
                                    '(2, 5, \'year\', \'2019\'),' +
                                    '(5, 2, \'year\', \'2018\'),' +
                                    '(7, 8, \'name\', \'The Vanishing\');');

        //TODO: INSERT INTO BOOK SERIE
        await this.executeQuery('INSERT INTO test.BookSerie (bookSerieId, name) VALUES' +
                                    '(1, \'Harry Potter\');');


        //TODO: INSERT INTO SERIES OF
        await this.executeQuery('INSERT INTO test.SeriesOf (bookId, bookSerieId) VALUES' +
                                    '(13, 1),' +
                                    '(14, 1),' +
                                    '(15, 1);');

        //Insert into Replies
        await this.executeQuery('INSERT INTO test.Replies (userId, bookId, date, text, authorId) VALUES' +
                                    '(2, 1, \'2021-04-10\', \'Thank you.\', 3),' +
                                    '(5, 2, \'2021-04-20\', \'I will consider this.\', 4),' +
                                    '(6, 13, \'2021-10-01\', \'I appreciate your comment.\', 15),' +
                                    '(7, 8, \'2021-05-03\', \'Thank you for your good comment.\', 10);');

        //Insert into Trades -> EKSTRA BUYER SELLER OLAYINA GEREK VAR MI YOKSA SATILMADIYSA NULL TUTMAK MI GEREKLI
        await this.executeQuery('INSERT INTO test.Trades (offerId, buyerId, sellerId, price, description, bookId) VALUES' +
                                    '(1, null, 2, 15, \'Second hand\', 1),' +
                                    '(2, 4, 2, 40, \'Brand new\', 5),' +
                                    '(3, 3, 5, 30, \'Brand new\', 7),' +
                                    '(4, 14, 10, 25, \'Second hand\', 4),' +
                                    '(5, null, 11, 50, \'Second hand\', 10),' +
                                    '(6, null, 3, 15, \'Second hand\', 2),' +
                                    '(7, null, 4, 40, \'Brand new\', 3),' +
                                    '(8, null, 5, 30, \'Brand new\', 4),' +
                                    '(9, null, 6, 25, \'Second hand\', 5),' +
                                    '(10, null, 7, 50, \'Second hand\', 6),' +
                                    '(11, null, 8, 15, \'Second hand\', 7),' +
                                    '(12, null, 9, 40, \'Brand new\', 8),' +
                                    '(13, null, 10, 30, \'Brand new\', 9),' +
                                    '(14, null, 11, 25, \'Second hand\', 10),' +
                                    '(15, null, 12, 50, \'Second hand\', 11),' +
                                    '(16, null, 13, 15, \'Second hand\', 12),' +
                                    '(17, null, 14, 40, \'Brand new\', 13),' +
                                    '(18, null, 15, 30, \'Brand new\', 14),' +
                                    '(19, null, 16, 25, \'Second hand\', 15),' +
                                    '(20, null, 3, 50, \'Second hand\', 12),' +
                                    '(21, null, 4, 60, \'Very Old\', 13);');

        //Grup
        await this.executeQuery('INSERT INTO Grup (groupId, name, description, isPrivate, userId) VALUES' +
                                    '(1, \'Stars\', \'Group of stars\', null, 2),' +
                                    '(2, \'Readers\', \'Group of book lovers\', 1, 5),' +
                                    '(3, \'Bookworms\', \'Group of bookworms\', null, 7);');

        //JoinsGroup -> GRUP KURULURKEN KURUCUYU BURAYA EKLEMEK ICIN TRIGGER VB BIR SEY YAZILABILIR
        await this.executeQuery('INSERT INTO JoinsGroup (groupId, userId) VALUES' +
                                    '(1, 2),' +
                                    '(1, 3),' +
                                    '(2, 5),' +
                                    '(2, 6),' +
                                    '(3, 7),' +
                                    '(3, 3),' +
                                    '(3, 10);');

        //GroupPost
        await this.executeQuery('INSERT INTO test.GroupPost (postId, groupId) VALUES' +
                                    '(1, 1),' +
                                    '(3, 2);');


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