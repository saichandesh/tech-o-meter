const express = require('express');
const router = express.Router();
const login = require('./login');

router.get('*',login);

module.exports = router;