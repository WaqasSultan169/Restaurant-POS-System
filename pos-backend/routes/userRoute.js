const express = require("express");
const { register, login, getUserData, logout } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerfication");
const router = express.Router();


// Authentication Routers
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout)

router.route("/").get(isVerifiedUser, getUserData);

module.exports = router;