const User = require("../models/user");
const ErrorResponse = require('../utils/Error')

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, userjson) => {
    if (err || !userjson) {
      return ErrorResponse(400,"No user found",req,res)
    }
    req.profile = userjson;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return ErrorResponse(400,"No user found",req,res)
    }
    return res.json(users);
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, userjson) => {
      if (err || userjson === null) {
        return ErrorResponse(400,"You are not authorized to update this user",req,res)
      }
      return res.json(userjson);
    }
  );
};

exports.deleteUserById = (req, res) => {
  User.findById(req.body.staffid).exec((err, staffjson) => {
    if (staffjson === null || err) {
      return ErrorResponse(400,"No such user found",req,res)
    }
    if (staffjson.userlevel <= req.profile.userlevel) {
      return ErrorResponse(400,"You are not authorized to delete this user",req,res)
    } else {
      User.findByIdAndDelete({ _id: req.body.staffid }, (err, userjson) => {
        if (err) {
          return ErrorResponse(400,"You are not authorized to delete this user",req,res)
        }
        return res.json(userjson);
      });
    }
  });
};
