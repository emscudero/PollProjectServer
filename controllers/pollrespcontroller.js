let express = require("express");
let router = express.Router();

const Responses = require("../db").import("../models/pollresponses");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var sequelize = require("../db");
let validateSession = require("../middleware/validate-sessions");

/* Endpoints

http://localhost:3000/responses/select/:poll_id - POST
http://localhost:3000/responses/getResult/:poll_id - GET
http://localhost:3000/responses/getAllResults - GET
http://localhost:3000/responses/countAll/:poll_id - GET

*/

/********************************
 * RESPONSES - SELECT
 * -> vote for a specific poll
 *
 * Used for:
 * - As a user, I want to select a single item from the list of choices, so I can cast my vote
 *******************************/
router.post("/select/:poll_id", validateSession, (req, res) => {
  if (req.user.role === "user") {
    const selection = {
      pollid: req.params.poll_id,
      pollselection: req.body.selection,
      userid: req.user.id,
    };

    Responses.create(selection)
      .then((selection) => {
        res.status(200).json({
          pollselection: selection,
          message: "User voted.",
        });
      })
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not a User" });
  }
});

/*******************************************************************************************
 * RESPONSES - GETRES
 * -> get all votes for a specific poll
 *
 * Used for:
 * - As a user, I want to see the vote totals after I submit mine, so I can see the current results
 *******************************************************************************************/
router.get("/getResult/:poll_id", validateSession, (req, res) => {
  if (req.user.role === "user") {
    const query = {
      where: { pollid: req.params.poll_id },
    };

    Responses.findAll(query)
      .then((polls) => res.status(200).json(polls))
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not a User" });
  }
});


/*******************************************************************************************
 * RESPONSES - GETALL
 * -> get all votes for all polls
 *
 * Used for:
 * - As an admin, I want to be able to see the results of the polls, so I can know what our team members think
 *******************************************************************************************/
 router.get("/getAllResults", validateSession, (req, res) => {
  if (req.user.role === "admin") {
    const query = {
      where: { userid: req.user.id },
    };

    Responses.findOne(query)
      .then(response => {
        // sequelize.query(
        //   `SELECT responses.pollid, responses.pollselection 
        //   FROM responses
        //   INNER JOIN polls
        //     on (polls.id = responses.pollid)
        //   INNER JOIN users
        //    on (users.id = polls.userid) where (users.id = ${req.user.id})`
        // )
        sequelize.query(
          `SELECT responses.pollid, responses.pollselection 
          FROM responses
          INNER JOIN polls
            on (polls.id = responses.pollid)`
        )
        .then(
          ([results, metadata]) => {
            res.status(200).json(results);
          },
          function findAllError(err) {
            res.send(500, err);
          }
        );
      }, function (err){res.send(500, err)})
    .catch(err => res.status(500).json({error: err}))

  } else {
    res.json({ message: "Not an Admin" });
  }
});


/*********************************************************************************************
 * RESPONSES - COUNTALL
 * -> count all votes for a specific poll
 *
 * Used for:
 * - As a user, I want to see the vote totals after I submit mine, so I can see the current results
 *********************************************************************************************/
router.get("/countAll/:poll_id", validateSession, (req, res) => {
  if (req.user.role === "user") {
    Responses.count({
      where: { pollid: req.params.poll_id },
    })
      .then((nbVotes) =>
        res.status(200).json({
          votes: nbVotes,
          message: "Votes counted!.",
        })
      )
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not a User" });
  }
});

module.exports = router;
