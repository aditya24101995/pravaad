const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
} = require("../controllers/room");

const {
  isSignedIn,
  authenticated,
  isAdmin,
  isSuperAdmin,
} = require("../controllers/auth");
const { getUser, getUserById, getAllUsers } = require("../controllers/user");

router.param("roomId", getRoom);
router.param("userId", getUserById);

router.post(
  "/create/:userId",
  [
    check("name", "Room name is required. Max length is 64 letters").isLength({
      max: 64,
    }),
  ],
  isSignedIn,
  authenticated,
  createRoom
);
router.put(
  "/update/:userId/:roomId",
  [
    check("name", "Room name is required. Max length is 64 letters").isLength({
      max: 64,
    }),
  ],
  isSignedIn,
  authenticated,
  updateRoom
);
router.delete("/delete/:userId/:roomId", isSignedIn, authenticated, deleteRoom);

module.exports = router;
