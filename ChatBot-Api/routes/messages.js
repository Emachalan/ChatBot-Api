var express = require('express');
var router = express.Router();
const { getMessages, getUserMessages, createMessage, updateMessage, deleteMessage, receivedMessages, readedMessages } = require("../models/messages");

/* CREATE user. */
router.post("/", function (req, response) {
  createMessage(req.body, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Create Message Successfully",
        data: res
      });
    }
  })
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  getMessages(null, function (err, response) {
    if (err) {
      res.send({
        message: err,
        data: null
      });
    } else {
      res.send({
        message: "Get Messages Successfully",
        data: response
      });
    }
  })
});

/* GET specific user. */
router.get("/usermessages/:from_id/:to_id", function (req, response) {
  var data = { from_id: req.params.from_id, to_id: req.params.to_id };
  getUserMessages(data, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Get Users Messages Successfully",
        data: res
      });
    }
  })
});

router.put("/:id", function (req, response) {
  updateMessage({ id: req.params.id, ...req.body }, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Update Message Successfully",
        data: res
      });
    }
  })
});

router.delete("/:id", function (req, response) {
  var data = { id: req.params.id };
  deleteMessage(data, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "delete Message Successfully",
        data: res
      });
    }
  })
});

router.post("/receivedmessages/:from_id/:to_id", function (req, response) {
  var data = { from_id: req.params.from_id, to_id: req.params.to_id };
  receivedMessages(data, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Received Messages Successfully",
        data: res
      });
    }
  })
});

router.post("/readedmessages/:from_id/:to_id", function (req, response) {
  var data = { from_id: req.params.from_id, to_id: req.params.to_id };
  readedMessages(data, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Readed Messages Successfully",
        data: res
      });
    }
  })
});

module.exports = router;
