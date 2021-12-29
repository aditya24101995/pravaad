const User = require("../models/user");
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
    console.log(err);
    console.log(userjson);
    if (err || userjson === null) {
      return res.status(400).json({
        error: "The email provided doesn't exist",
      });
    }

    if (!userjson.authenticate(password)) {
      return res.status(400).json({
        error: "Password does not match",
      });
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
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //Create User
  const user = new User(req.body);
  user.save((err, userjson) => {
    if (err) {
      return res.status(400).json({
        err: "Bad request",
      });
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
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 2) {
    return res.status(403).json({
      error: "You are not admin. ACCESS DENIED",
    });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.profile.role === 1) {
    return res.status(403).json({
      error: "You are not super admin. ACCESS DENIED",
    });
  }
  next();
};
