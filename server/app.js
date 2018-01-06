const express = require('express');
const app = express();
const router = require('./routes/router');
const bodyParser = require('body-parser');

// Set Port Number
const port = process.env.PORT || 8080;
app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/',router); 

app.listen(port, () => {
    console.log(`Listening on Port Number ${port}`);
});