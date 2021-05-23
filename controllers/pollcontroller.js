let express = require("express");
let router = express.Router();
const Poll = require("../db").import("../models/poll");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var sequelize = require("../db");
let validateSession = require("../middleware/validate-sessions");

/* Endpoints

http://localhost:3000/poll/create - POST
http://localhost:3000/poll/update - PUT
http://localhost:3000/poll/delete - DELETE
http://localhost:3000/poll/getAll - GET

*/

/****************************************************************************
 * POLL - CREATE
 * -> create a new poll ( question + answers - at least 2 responses up to 4)
 *
 * Used for:
 * - As an admin, I want to create a poll, so that people can vote on it
 ***************************************************************************/
router.post("/create", validateSession, (req, res) => {
  if (req.user.role === "admin") {
    const pollEntry = {
      question: req.body.question,
      response1: req.body.response1,
      response2: req.body.response2,
      response3: req.body.response3,
      response4: req.body.response4,
      userID: req.user.id,
    };
    Poll.create(pollEntry)
      .then((poll) => {
        res.status(200).json({
          poll: poll,
          message: "New poll created.",
        });
      })
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not an Admin" });
  }
});

/***************************************************************************************
 * POLL - DELETE
 * -> delete a specific poll
 *
 * Used for:
 * - As an admin, I want to be able to delete a poll, so I can keep the polls organized
 ****************************************************************************************/
router.delete("/delete/:id", validateSession, (req, res) => {
  if (req.user.role === "admin") {
    const query = { where: { id: req.params.id, userID: req.user.id } };

    Poll.destroy(query)
      .then((response) =>
        res.status(200).json({
          message: response > 0 ? " Poll deleted" : "Deleting poll failed.",
        })
      )
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not an Admin" });
  }
});

/*******************************************************
 * POLL - UPDATE
 * -> edit and update a poll (question and/or responses)
 *
 * Used for:
 * - As an admin, I want to be able to edit a poll, so I can make changes
 *******************************************************/
router.put("/update/:id", validateSession, (req, res) => {
  if (req.user.role === "admin") {
    const updatePollEntry = {
      question: req.body.question,
      response1: req.body.response1,
      response2: req.body.response2,
      response3: req.body.response3,
      response4: req.body.response4,
    };

    const query = { where: { id: req.params.id, userID: req.user.id } };

    Poll.update(updatePollEntry, query)
      .then((poll) =>
        res.status(200).json({
          message: poll > 0 ? "Poll updated" : "Couldn't update this poll",
        })
      )
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not an Admin" });
  }
});

/**********************************************
 * POLL - GETALL
 * -> get the list of a specific admin's polls
 *
 * Used for:
 * - As a user, I want to see a list of items, so I can vote on one
 * - As a user, I want to be able to see all of the poll questions, so that I know what are available to vote on
 * - As an admin, I want to be able to see all the poll questions, so that I can know what is available for users to vote on
 **********************************************/
router.get("/getAll", validateSession, (req, res) => {
  if (req.user.role === "admin" || req.user.role === "user") {
    Poll.findAll({
      where: { userID: req.user.id },
    })
      .then((polls) => res.status(200).json(polls))
      .catch((err) => res.status(500).json({ error: err }));
  } else {
    res.json({ message: "Not an User" });
  }
});

module.exports = router;
