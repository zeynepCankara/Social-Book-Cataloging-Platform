import express from 'express';
import parse from 'body-parser';

const app = express();
const port = 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

app.post('/login', parse.json(), (req, res) => {
    console.log(req.body);
    const { name, password } = req.body;
    // TODO: Check database whether this credentials are valid
    res.status(200).send(`testLogin with ${name} and ${password}`);
})