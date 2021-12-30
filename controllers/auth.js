const User = require("../models/user");
const ErrorResponse = require('../utils/Error')
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//Sign In controller
exports.signin = (req, res) => {
  const { email, password } = req.body;

  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, userjson) => {
    if (err || userjson === null) {
      return ErrorResponse(400,"The email provided does not exist",req,res)
    }

    if (!userjson.authenticate(password)) {
        return ErrorResponse(400,"Password does not match",req,res)
    }

    const token = jwt.sign({ _id: userjson._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to frontend
    const { _id, firstname, lastname, email, role } = userjson;
    return res.json({ token, user: { _id, firstname, lastname, email, role } });
  });
};

exports.register = (req, res) => {
  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    /* return res.status(422).json({
      error: errors.array()[0].msg,
    }); */
    return ErrorResponse(422,errors.array()[0].msg,req,res)
  }

  //Create User
  const user = new User(req.body);
  user.save((err, userjson) => {
    if (err || userjson===null) {
        return ErrorResponse(400,"Bad request",req,res)
    }
    if (userjson) {
      res.json({
        name: userjson.firstname + userjson.lastname,
        email: userjson.email,
        description: userjson.description,
        id: userjson._id,
      });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out",
  });
};

//Token authorization route controller
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.authenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return ErrorResponse(403,"ACCESS DENIED",req,res)
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 2) {
    return ErrorResponse(403,"You are not an admin. ACCESS DENIED",req,res)
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.profile.role === 1) {
    return ErrorResponse(403,"You are not a super admin. ACCESS DENIED",req,res)
  }
  next();
};
