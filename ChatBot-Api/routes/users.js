require("dotenv").config();
var express = require('express');
var router = express.Router();
const Vonage = require('@vonage/server-sdk');

const { getUsers, getUser, createUser, updateLastseen, updateUser } = require("../models/users");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

/* CREATE user. */
router.post("/", function (req, response) {
    createUser(req.body, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Create User Successfully",
        data: res
      });
    }
  })
});

router.post("/account-create", function(req,response){
  vonage.verify.request({
    number: req.body.number,
    brand: "Vonage"
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      const verifyRequestId = result.request_id;
      response.send({
        message: "Code send Successfully",
        data: verifyRequestId
      });
    }
  });
});

router.get("/check-auth", function(req,response){
  vonage.verify.check({
    request_id: req.query.request_id,
    code: req.query.code
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  getUsers(null, function (err, response) {
    if (err) {
      res.send({
        message: err,
        data: null
      });
    } else {
      res.send({
        message: "Get Users Successfully",
        data: response
      });
    }
  })
});

/* GET specific user. */
router.get("/:id", function (req, response) {
  var data = { id: req.params.id };
  getUser(data, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Get User Successfully",
        data: res
      });
    }
  })
});

router.put("/:id", function (req, response) {
  updateUser({ id: req.params.id, ...req.body}, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Update User Successfully",
        data: res
      });
    }
  })
});

router.post("/lastseen/:id", function (req, response) {
  updateLastseen({id: req.params.id}, function (err, res) {
    if (err) {
      response.send({
        message: err,
        data: null
      });
    } else {
      response.send({
        message: "Update User Lastseen Successfully",
        data: res
      });
    }
  })
});

module.exports = router;
