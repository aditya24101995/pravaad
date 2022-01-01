const express = require("express");
const router = express.Router();
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
} = require("../controllers/room");

const {
  isSignedIn,
  authenticated,
  isAdmin,
  isSuperAdmin,
} = require("../controllers/auth");
const { getUser, getUserById, getAllUsers } = require("../controllers/user");

router.param("roomId", getRoomById);

router.post(
  "/create",
  [
    check("name", "Room name is required. Max length is 64 letters").isLength({
      max: 64,
    }),
  ],
  isSignedIn,
  authenticated,
  createRoom
);
router.put("/update/:roomId", isSignedIn, authenticated, updateRoom);
router.delete("/delete/:roomId", isSignedIn, authenticated, deleteRoom);
