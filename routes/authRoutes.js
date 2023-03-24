const express = require("express")
const router = express.Router()
const loginLimiter = require("../middleware/loginLimiter")
const authController = require("../controllers/authController")




router.route("/").post(loginLimiter,authController.login)
router.route("/refresh").post(authController.refresh)