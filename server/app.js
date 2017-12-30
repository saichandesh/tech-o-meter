const express = require('express');
const app = express();

const router = require('./routes/router');

// Set Port Number
const port = process.env.PORT || 8080;
app.set('port', port);

app.use('/',router); 

app.listen(port, () => {
    console.log(`Listening on Port Number ${port}`);
});