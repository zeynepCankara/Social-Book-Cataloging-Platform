import express from 'express';
import parse from 'body-parser';
import Connection from './connection.js';

async function runServer() {
    const app = express();
    const port = 3001;
    const connection = new Connection();
    await connection.initDatabase();
    
    async function getUserIDFromUsername(username) {
        const results = await connection.executeQuery(`SELECT userId FROM User WHERE userName = '${username}'`);
        return results[0].userId;
    }

    async function getUsernameFromUserID(userId) {
        const results = await connection.executeQuery(`SELECT userName FROM User WHERE userId = ${userId}`);
        return results[0].userName;
    }
    
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
    
    /**
     * Checks the credentials of user trying to login and returns status 200 if they are valid, return 400 otherwise
     */
    app.post('/login', parse.json(), async (req, res) => {
        console.log('login', req.body);
        const { username, password, userType } = req.body;

        const nameResults = await connection.executeQuery(`SELECT * FROM User WHERE userName = '${username}'`);
        const passwordResults = await connection.executeQuery(`SELECT * FROM User WHERE userName = '${username}' AND password = '${password}'`);
        const userTypeResults = await connection.executeQuery(`SELECT * FROM User WHERE userName = '${username}' AND password = '${password}' AND userType = '${userType}'`);
        if(nameResults.length === 0){
            res.status(400).send(`Username is invalid!`);
        }else if(passwordResults.length === 0){
            res.status(400).send(`Password is invalid!`);
        }else if(userTypeResults.length === 0){
            res.status(400).send(`userType is invalid!`);
        }else{
            res.status(200).send(`testLogin with ${username} and ${password}`);
        }

    })

    /**
     * Saves new user
     */
    app.post('/signup', parse.json(), async (req, res) => {
        console.log('signup', req.body);
        const { name, username, email, password, userType } = req.body;
        // TODO: Check database whether this credentials are valid
        const userCheckResults = await connection.executeQuery(`SELECT userName FROM User WHERE username = '${username}'`);
        if(userCheckResults.length !== 0){
            res.status(400).send(`Specified username is already used by another!`);
            return;
        }
        const uniqueUserId = await connection.executeQuery(`SELECT MAX(userId) AS userId FROM User`);
        const uniqueId = uniqueUserId[0].userId + 1;
        console.log(uniqueUserId);
        await connection.executeQuery(`INSERT INTO User VALUES('${uniqueId}','${username}','${name}','${email}','${password}','${userType}')`);
        res.status(200).send(`testSignup with ${name} and ${password}`);
    })

    /**
     * Get all books
     */
    app.get('/getAllBooks', parse.json(), async (req, res) => {
        console.log('getAllBooks');
        const results = await connection.executeQuery('SELECT * FROM Book;');
        res.status(200).send(results);
    })

    
    app.post('/getFilteredBooks', parse.json(), async (req, res) => {
        console.log('getFilteredBooks', req.body);
        const { bookName, author, genre, publishYear } = req.body;
        const filters = [
            bookName && `name LIKE '%${bookName}%'`,
            author && `authorName LIKE '%${author}%'`,
            genre && `genre LIKE '%${genre}%'`,
            publishYear && `year BETWEEN ${publishYear[0]} AND ${publishYear[1]}`
        ];
        const whereClause = filters.filter(e => e).join(' AND ');
        const results = await connection.executeQuery(`SELECT * FROM Book WHERE ${whereClause};`)
        res.status(200).send(results);
    })
    
    app.post('/getTrackedBooks', parse.json(), async (req, res) => {
        console.log('getTrackedBooks', req.body);
        const { username } = req.body;
        /*
        response should be in this format:
        {
            bookID: {
                edition: { editionInformation... },
                progresses: [
                    {
                        page_number: firstProgress' pageNumber,
                        date: firstProgress' date,
                    },
                    {
                        page_number: secondProgress' pageNumber,
                        date: secondProgress' date,
                    }
                ]   
            },
            otherBookID...
        }
    
        */
        res.status(200).send({
            1: {
                edition: {
                    bookId: 1,
                    number: 1,
                    publisher: 'X',
                    pageCount: 258,
                    format: 'Print',
                    language: 'English',
                    translator: 'Ahmet'
                },
                progresses: [
                    {
                        pageNumber: 10,
                        date: '2020-01-01'
                    },
                    {
                        pageNumber: 50,
                        date: '2020-02-01'
                    },
                ]
            }
        });
    })

    app.post('/getReviews', parse.json(), async (req, res) => {
        console.log('getReviews', req.body);
        const { username } = req.body;
        // Get all reviews done by specified user

        const userId = await getUserIDFromUsername(username);
        const results = await connection.executeQuery(`SELECT * FROM Reviews WHERE userId = '${userId}'`)
        res.status(200).send(results);
    })

    app.post('/getEditions', parse.json(), async (req, res) => {
        console.log('getEditons', req.body);
        const { bookId } = req.body;
        const results = await connection.executeQuery(`SELECT * FROM Edition WHERE bookId = '${bookId}'`);
        res.status(200).send(results);
    })

    app.post('/startTracking', parse.json(), async (req, res) => {
        console.log('startTracking', req.body);
        const { username, edition } = req.body; // Edition is the same format as above
        const userId = await getUserIDFromUsername(username);
        await connection.executeQuery(`INSERT INTO Tracks VALUES('${userId}', '${edition.bookId}', '${edition.number}', '${edition.publisher}', '${edition.format}', '${edition.language}')`);
        res.status(200).send();
    })

    app.post('/addReview', parse.json(), async (req, res) => {
        console.log('addReview', req.body);
        const { username, bookId, rate, comment, date } = req.body;
        const userId = await getUserIDFromUsername(username);
        await connection.executeQuery(`INSERT INTO Reviews VALUES('${userId}', '${bookId}', '${rate}', '${comment}', '${date}')`);
        res.status(200).send();
    })

    //CHECK AFTER GETTRACKEDBOOKS IS IMPLEMENTED
    app.post('/addProgress', parse.json(), async (req, res) => {
        console.log('addProgress', req.body);
        const { pageNumber, date, username, bookId, number, publisher, format, language} = req.body;
        const userId = await getUserIDFromUsername(username); 
        await connection.executeQuery(`INSERT INTO Progress VALUES('${pageNumber}', '${date}', '${userId}', '${bookId}', '${number}', '${publisher}', '${format}', '${language}')`);
        res.status(200).send();
    })

    app.post('/getBooksOfAuthor', parse.json(), async (req, res) => {
        // Already implemented
        console.log('getBooksOfAuthor', req.body);
        const { username } = req.body;
        const authorId = await getUserIDFromUsername(username);

        const results = await connection.executeQuery(`SELECT * FROM Book WHERE authorId = ${authorId}`);
        res.status(200).send(results);
    })

    app.post('/getReviewsForBook', parse.json(), async (req, res) => {
        // Already implemented
        console.log('getReviewsForBook', req.body);
        const { bookId } = req.body;

        const results = await connection.executeQuery(`SELECT * FROM Reviews NATURAL JOIN User WHERE bookId = ${bookId}`);
        res.status(200).send(results);
    })

    app.post('/getReplies', parse.json(), async (req, res) => {
        // Already implemented
        console.log('getReplies', req.body);
        const { username } = req.body;

        const authorId = await getUserIDFromUsername(username);

        const results = await connection.executeQuery(`SELECT * FROM Replies WHERE authorId = '${authorId}'`);
        res.status(200).send(results);
    })

    app.post('/addReply', parse.json(), async (req, res) => {
        console.log('addReply', req.body);
        const { userId, bookId, date, text, authorName } = req.body;

        const authorId = await getUserIDFromUsername(authorName);
        const results = await connection.executeQuery(`INSERT INTO Replies VALUES('${userId}', '${bookId}', '${date}', '${text}', '${authorId}')`);
        res.status(200).send();
    })
}

runServer();