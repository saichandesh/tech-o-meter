const express = require('express');
const router = express.Router();

const login = require('./login');
const mysql = require('mysql');

// Datbase connection
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

con.connect( err => {
    if (err) throw err;
    console.log(`connected`);
});

router.get('/login',(req,res) => login(req,res,con));

module.exports = router;