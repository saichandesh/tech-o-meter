const express = require('express');
const router = express.Router();
const mysql = require('mysql');
  
const login = require('./login');
const logout = require('./logout');
const expense = require('./expense');
const settings = require('./settings');
const startTrip = require('./startTrip');
const endTrip = require('./endTrip');
const tripHistory = require('./tripHistory');
const userTrackHistory = require('./userTrackHistory');

const googleMapApiClient = require('@google/maps').createClient({
    key: process.env.KEY
});

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Datbase connection
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

conn.connect( err => {
    if (err) throw err;
    console.log(`connected`);
});

router.post('/login',(req,res) => login(req,res,conn, response));
router.post('/logout',(req,res) => logout(req,res,conn, response));
router.post('/expense',(req,res) => expense(req,res,conn, response));
router.post('/settings',(req,res) => settings(req,res,conn, response));
router.post('/starttrip',(req,res) => startTrip(req,res,conn, response,googleMapApiClient));
router.post('/endtrip',(req,res) => endTrip(req,res,conn, response,googleMapApiClient));
router.post('/triphistory',(req,res) => tripHistory(req,res,conn, response));
router.post('/usertrackhistory',(req,res) => userTrackHistory(req,res,conn, response, googleMapApiClient));

module.exports = router;