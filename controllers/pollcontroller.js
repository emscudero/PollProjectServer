let express = require('express');
let router = express.Router();
const Poll = require('../db').import('../models/poll');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

var sequelize = require("../db");
let validateSession = (require('../middleware/validate-sessions'));

/* Endpoints

http://localhost:3000/poll/create - POST
http://localhost:3000/poll/update - PUT
http://localhost:3000/poll/delete - DELETE
http://localhost:3000/poll/getAll - GET

*/

/*****************
 * POLL - CREATE
 ****************/
 router.post('/create', validateSession, (req,res) => {
    const pollEntry = {
        question: req.body.question,
        response1: req.body.response1,
        response2: req.body.response2,
        response3: req.body.response3,
        response4: req.body.response4,
        userID: req.user.id
    }
    Poll.create(pollEntry)
    .then((poll) => {
        res.status(200).json({
            poll: poll,
            message: "New poll created."
        })
    })
    .catch(err => res.status(500).json({error: err}))

})


/********************
* POLL - DELETE  *
*******************/
router.delete('/delete/:id', validateSession, (req,res) => {
    const query = { where: { id: req.params.id, userID: req.user.id} };

    Poll.destroy(query)
    .then((response) => res.status(200).json({ 
        message: response > 0 ?  " Poll deleted": "Deleting poll failed."
    }))
    .catch((err) => res.status(500).json({error: err}));
});


/******************
 * POLL - UPDATE  *
 *****************/
 router.put('/update/:id', validateSession, (req,res) => {
    const updatePollEntry = {
        question: req.body.question,
        response1: req.body.response1,
        response2: req.body.response2,
        response3: req.body.response3,
        response4: req.body.response4
  };
  
  const query = { where: { id: req.params.id, userID: req.user.id} };
  
  Poll.update(updatePollEntry, query)
  .then((poll) => res.status(200).json({
      message: poll > 0? "Poll updated" : "Couldn't update this poll"})
  )
  .catch((err) => res.status(500).json({error: err}));
  })



/****************
* POLL - GETALL  *
*****************/
router.get('/getAll', validateSession, (req,res) => {
    Poll.findAll({
        where: { userID: req.user.id }
    })
    .then(polls => res.status(200).json(polls))
    .catch(err => res.status(500).json({error: err}))
})



module.exports = router