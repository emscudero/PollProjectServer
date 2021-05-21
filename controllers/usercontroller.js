let express = require('express');
let router = express.Router();
const User = require('../db').import('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');


/* Endpoints

http://localhost:3000/user/create - POST
http://localhost:3000/user/login - POST

*/

/*****************
 * USER - CREATE
 ****************/
 router.post('/create', function(req,res){
    User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 13),
        role: req.body.role
    })

    .then( user => {

        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(200).json({
            user: user,
            message: "New user has been created.",
            sessionToken: token
        });
    })
    .catch(err => res.status(500).json({error :err}))
});


/***************
* USER - LOGIN
***************/

router.post('/login', function(req,res) {

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(
        function loginSuccess(user){
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err,matches) {
                    if(matches){

                        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60* 60 * 24});

                        res.status(200).json({
                            user:user,
                            message: 'User successfully logged in',
                            sessionToken : token
                        })
                    } else {
                        res.status(502).json({error: 'login failed'})
                    }
                });

            } else {
                res.status(500).json({error: 'user does not exist'})
            }
        }
    )
    .catch(err => res.status(500).json({error: err}))

});

module.exports = router