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
        const userId = await getUserIDFromUsername(username);
        const results = await connection.executeQuery(`SELECT * FROM Tracks WHERE userId = ${userId}`);

        let formattedResult = {};
        for (const row in results) {
            const edition = await connection.executeQuery(`SELECT * FROM Edition WHERE bookId = ${results[row].bookId} AND number = ${results[row].number
                                                                } AND publisher = '${results[row].publisher}' AND format = '${results[row].format 
                                                                }' AND language = '${results[row].language}'`);
            const progresses = await connection.executeQuery(`SELECT pageNumber, date FROM Progress WHERE bookId = ${results[row].bookId
                                                                } AND number = ${results[row].number} AND userId = ${results[row].userId
                                                                } AND publisher = '${results[row].publisher}' AND format = '${results[row].format 
                                                                }' AND language = '${results[row].language}'`);
            formattedResult[results[row].bookId] = {
                edition: edition[0],
                progresses
            }
        }
        res.status(200).send(formattedResult);
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

    app.post('/addEdition', parse.json(), async (req, res) => {
        console.log('addEdition', req.body);
        const { number, publisher, pageCount, format, language, bookId, translator } = req.body;
        if (translator){
            await connection.executeQuery(`INSERT INTO Edition VALUES('${bookId}', '${number}', '${publisher}', '${pageCount}', '${format}', '${language}', '${translator}')`);
        }else{
            await connection.executeQuery(`INSERT INTO Edition VALUES('${bookId}', '${number}', '${publisher}', '${pageCount}', '${format}', '${language}', null)`);
        }
       
        res.status(200).send();
    })

    app.post('/publishBook', parse.json(), async (req, res) => {
        console.log('publishBook', req.body);
        const { name, year, genre, authorName } = req.body;
        //Finding new unique bookId
        const uniqueBookId = await connection.executeQuery(`SELECT MAX(bookId) AS bookId FROM Book`);
        const bookId = uniqueBookId[0].bookId + 1;
        //Getting the name of the author
        const names = await connection.executeQuery(`SELECT name FROM User WHERE username = '${authorName}'`);
        const authorname = names[0].name;
        //Insert book into the book table
        const authorId = await getUserIDFromUsername(authorName);
        await connection.executeQuery(`INSERT INTO Book VALUES('${bookId}', '${genre}', '${year}', '${name}', '${authorId}', '${authorname}')`);
        res.status(200).send();
    })

    app.post('/createBooklist', parse.json(), async (req, res) => {
        console.log('createBooklist', req.body);
        const { name, date, description, username } = req.body;
    
        const ownerId = await getUserIDFromUsername(username);
        const maxBookId = await connection.executeQuery(`SELECT MAX(bookListId) AS booklistid FROM BookList`);
        const booklistId = maxBookId[0].booklistid + 1;
        await connection.executeQuery(`INSERT INTO BookList VALUES('${booklistId}', '${name}', '${date}', '${description}', '${ownerId}')`);

        res.status(200).send({booklistId});

    })

    app.post('/getBooklists', parse.json(), async (req, res) => {
        // Get booklists
        console.log('getBooklists', req.body);
        const { username } = req.body;
        const userId = await getUserIDFromUsername(username);
        const results = await connection.executeQuery(`SELECT * FROM BookList WHERE ownerId = '${userId}'`);
        res.status(200).send(results);
    })

    app.post('/getBooklistContent', parse.json(), async (req, res) => {
        console.log('getBooklistContent', req.body);
        const { bookListId } = req.body;
        const results = await connection.executeQuery(`SELECT * FROM Contains NATURAL JOIN Book WHERE bookListId = '${bookListId}'`);
        res.status(200).send(results);
    })

    app.post('/addBooksToBooklist', parse.json(), async (req, res) => {
        console.log('addBooksToBooklist', req.body);
        const { bookListId, bookIds } = req.body;
        await connection.executeQuery(`INSERT INTO Contains VALUES ${bookIds.map(id => `(${bookListId}, ${id})`).join(', ')};`);
        res.status(200).send();
    })

    app.post('/deleteBookFromBooklist', parse.json(), async (req, res) => {
        console.log('deleteBookFromBooklist', req.body);
        const { bookListId, bookId } = req.body;
        await connection.executeQuery(`DELETE FROM Contains WHERE (bookListId,bookId) = (${bookListId}, ${bookId})`);
        res.status(200).send();
    })

    app.post('/createTrade', parse.json(), async (req, res) => {
        console.log('createTrade', req.body);
        const { username, price, description, bookId } = req.body;

        const sellerId = await getUserIDFromUsername(username);
        const offerIds = await connection.executeQuery(`SELECT MAX(offerId) as offerId FROM Trades`);
        const offerid = 0;
        if(offerIds.length === 0){ //There is no trades in the table
            offerid = 1;
        }else{                      //Get the max offerId and increment it by one
            offerid = offerIds[0].offerId;
            offerid = offerid + 1;
        }
        await connection.executeQuery(`INSERT INTO Trades VALUES(${offerid}, null, ${sellerId}, '${price}', '${description}', ${bookId})`);

        res.status(200).send();
    })

    app.post('/viewTrades', parse.json(), async (req, res) => {
        console.log('viewTrades', req.body);
        const { bookId } = req.body;

        // Get only trades whose buyerId null
        const results = await connection.executeQuery(`SELECT* FROM Trades WHERE bookId = ${bookId} AND buyerId = null`);
        res.status(200).send(results);
    })

    app.post('/buyBook', parse.json(), async (req, res) => {
        console.log('buyBook', req.body);
        const { offerId, username } = req.body;

        const buyerId = await getUserIDFromUsername(username);
        await connection.executeQuery(`UPDATE Trades SET buyerId = ${buyerId} WHERE offerId = ${offerId}`);

        res.status(200).send();
    })

    app.post('/getBoughtBooks', parse.json(), async (req, res) => {
        console.log('getBoughtBooks', req.body);
        const { username } = req.body;

        const buyerId = await getUserIDFromUsername(username);
        const results = await connection.executeQuery(`SELECT * FROM Trades WHERE buyerId = ${buyerId}`);

        res.status(200).send(results);
    })

    app.post('/createChallenge', parse.json(), async (req, res) => {
        console.log('createChallenge', req.body);
        const { name, startDate, endDate, description, type, bookCount, username } = req.body;

        const creatorId = await getUserIDFromUsername(username);
        const challengeIDs = await connection.executeQuery(`SELECT MAX(challengeId) as challengeid FROM Challenge`);
        let newChallengeId = 1;
        if(challengeIDs.length !== 0){
            newChallengeId = challengeIDs[0].challengeid;
            newChallengeId = newChallengeId + 1;
        }
        await connection.executeQuery(`INSERT INTO Challenge VALUES(${newChallengeId}, '${name}', '${startDate}', '${endDate}', '${description}', '${type}', ${creatorId}, ${bookCount})`);

        res.status(200).send();
    })

    app.post('/getAvailableChallenges', parse.json(), async (req, res) => {
        console.log('getAvailableChallenges', req.body);
        const results = await connection.executeQuery(`SELECT * FROM Challenge WHERE endDate >= (SELECT CURRENT_DATE)`);
        res.status(200).send(results);
    })

    app.post('/joinChallenge', parse.json(), async (req, res) => {
        console.log('joinChallenge', req.body);
        const { username, challengeId } = req.body;
        
        const userId = await getUserIDFromUsername(username);

        const results = await connection.executeQuery(`INSERT INTO JoinsChallenge VALUES (${challengeId}, ${userId}, 0, null)`);

        res.status(200).send();
    })

    app.post('/getAllParticipantsOfChallenge', parse.json(), async (req, res) => {
        console.log('getAllParticipantsOfChallenge', req.body);
        const { challengeId } = req.body;

        const results = await connection.executeQuery(`SELECT * FROM JoinsChallenge NATURAL JOIN User WHERE challengeId = ${challengeId} ORDER BY score DESC`);
        res.status(200).send(results);
    })

    app.post('/getChallengeOutcomesForUser', parse.json(), async (req, res) => {
        console.log('getChallengeOutcomesForUser', req.body);
        const { username } = req.body;

        const userId = await getUserIDFromUsername(username);
        const results = await connection.executeQuery(`CALL getAchievementInfo(${userId})`);

        res.status(200).send(results);
    })

    app.post('/mostPopularTenChallenge', parse.json(), async (req, res) => {
        console.log('mostPopularTenChallenge', req.body);
        const results = await connection.executeQuery(`SELECT name, totalParticipant FROM (SELECT name, challengeId, totalParticipant FROM Challenge NATURAL JOIN (SELECT challengeId, COUNT(score) AS totalParticipant FROM JoinsChallenge GROUP BY challengeId) AS temp) AS temp2 ORDER BY totalParticipant DESC LIMIT 10`);
        res.status(200).send(results);
    })

    app.post('/mostPopularTenBooks', parse.json(), async (req, res) => {
        console.log('mostPopularTenBooks');
        const results = await connection.executeQuery(`SELECT bookId, COUNT(userID) AS totalTrack, authorName, genre,name FROM (SELECT userId, Tracks.bookId, temp.authorName, temp.genre, temp.name FROM Tracks JOIN (SELECT bookId, authorName, genre, name, year FROM Book) AS temp ON Tracks.bookId = temp.bookId) AS temp2 GROUP BY bookId, authorName,genre,name ORDER BY totalTrack desc LIMIT 10`);
        res.status(200).send(results);
    })

    app.post('/getAllReviews', parse.json(), async (req, res) => {
        console.log('getAllReviews');
        const results = await connection.executeQuery('SELECT * FROM Reviews NATURAL JOIN User ORDER BY date DESC')
        res.status(200).send(results);
    })
}

runServer();