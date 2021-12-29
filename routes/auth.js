//User login route, user logout route, password verification route, password reset route
const express = require("express");
const router = express.Router();
const { register, signin, signout } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required of minimum 3 characters").isLength({
      min: 3,
    }),
  ],
  signin
);

//Signup
router.post(
  "/register",
  [
    check("firstname", "Name should have atleast 3 characters").isLength({
      min: 3,
    }),
    check("lastname", "Name should have atleast 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should have atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  register
);

//Signout
router.get("/signout", signout);

//Authorization

module.exports = router;
