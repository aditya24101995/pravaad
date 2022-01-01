const User = require("../models/user");
const Room = require("../models/room");
const ErrorResponse = require("../utils/Error");
const { check, validationResult } = require("express-validator");

/**
 *
 * @param {Room Name, User id (Optional)} req
 * @param {*Room Id} res
 */
const createRoom = (req, res) => {};

/**
 *
 * @param {Room Name, User Id} req
 * @param {*Updated Values} res
 */
const updateRoom = (req, res) => {};

/**
 *
 * @param {Room Name / Room Id} req
 * @param {* boolean} res
 */
const deleteRoom = (req, res) => {};

/**
 *
 * @param {Room Id} req
 * @param {*Room Info} res
 */
const getRoomById = (req, res) => {};
