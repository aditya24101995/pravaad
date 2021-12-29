const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, userjson) => {
    if (err || !userjson) {
      return res.status(400).json({
        error: "No user found",
      });
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
      return res.status(400).json({
        error: "No user found",
      });
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
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update this user",
        });
      }
      return res.json(userjson);
    }
  );
};

exports.deleteUserById = (req, res) => {
  User.findById(req.body.staffid).exec((err, staffjson) => {
    if (err || err === null) {
      return res.status(400).json({
        error: "No such user found",
      });
    }
    if (staffjson.userlevel <= req.profile.userlevel) {
      return res
        .status(400)
        .json({ error: "You are not authorized to delete this user" });
    } else {
      User.findByIdAndDelete({ _id: req.body.staffid }, (err, userjson) => {
        if (err) {
          return res.status(400).json({
            error: "You are not authorized to delete this user",
          });
        }
        return res.json(userjson);
      });
    }
  });
};
