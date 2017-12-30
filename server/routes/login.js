const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});
  
con.connect( err => {
    if (err) throw err;
    console.log("Connected!");
});

const login = (req,res) => {
    res.send(`Hello`);
}

module.exports = login;