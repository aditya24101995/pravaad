//User registration route
const express = require("express");
const router = express.Router();
const {
  isSignedIn,
  authenticated,
  isAdmin,
  isSuperAdmin,
} = require("../controllers/auth");
const {
  getUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUserById,
} = require("../controllers/user");

router.param("userId", getUserById);

router.delete("/user/:userId", isSignedIn, authenticated, deleteUserById);

router.get("/user/:userId", isSignedIn, authenticated, getUser);

router.get("/users", getAllUsers);

router.put("/user/:userId", isSignedIn, authenticated, updateUser);


module.exports = router;
