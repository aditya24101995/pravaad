const User = require("../models/user");
const Room = require("../models/room");
const ErrorResponse = require("../utils/Error");
const { check, validationResult } = require("express-validator");

/**
 *
 * @param {Room Name, User id (Optional)} req
 * @param {*Room Id} res
 */
exports.createRoom = (req, res) => {
  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorResponse(422, errors.array()[0].msg, req, res);
  }

  //Check if User has access to create room
  if (req.profile.roomaccess > 1) {
    return ErrorResponse(
      400,
      "Room can not be created. ACCESS DENIED",
      req,
      res
    );
  }

  //Create Room
  const room = new Room(req.body);
  room.save((err, roomjson) => {
    if (err || roomjson === null) {
      return ErrorResponse(400, "Bad request", req, res);
    }
    if (roomjson) {
      res.json({
        id: roomjson._id,
        name: roomjson.name,
        users: roomjson.users,
      });
    }
  });
};

/**
 *
 * @param {Room Name, User Id} req
 * @param {*Updated Values} res
 */
exports.updateRoom = (req, res) => {
  //Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorResponse(422, errors.array()[0].msg, req, res);
  }

  //Check if User has access to update room
  if (req.profile.roomaccess > 2) {
    return ErrorResponse(
      400,
      "You are not allowed to update room information.",
      req,
      res
    );
  }

  Room.findByIdAndUpdate(
    { _id: req.room._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, roomjson) => {
      if (err || roomjson === null) {
        return ErrorResponse(
          400,
          "You are not authorized to update this room",
          req,
          res
        );
      }
      return res.json(roomjson);
    }
  );
};

/**
 *
 * @param {Room Name / Room Id} req
 * @param {* boolean} res
 */
exports.deleteRoom = (req, res) => {
  //Check if User has access to update room
  if (req.profile.roomaccess > 1) {
    return ErrorResponse(
      400,
      "You are not allowed to delete the room",
      req,
      res
    );
  }

  Room.findById(req.body.roomid).exec((err,roomjson)=>{
    if(err || roomjson === null){
      return ErrorResponse(400,"No such room found",req,res)
    }
    Room.findByIdAndDelete({ _id: req.body.roomid }, (err, roomjson) => {
      if (err) {
        return ErrorResponse(400,"You are not authorized to delete this room",req,res)
      }
      return res.json(roomjson);
    });
  })
};

/**
 *
 * @param {Room Id} req
 * @param {*Room Info} res
 */
exports.getRoom = (req, res) => {
  Room.findById(id).exec((err, roojson) => {
    if (err || !roomjson) {
      return ErrorResponse(400, "No room found", req, res);
    }
    req.room = roomjson;
    next();
  });
};
