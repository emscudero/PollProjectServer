let express = require('express');
let router = express.Router();
const User = require('../db').import('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


router.get('/test', function(req, res){
    res.send("this is a test from pollcontroller")
})



module.exports = router