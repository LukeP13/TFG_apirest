const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { default: authenticate } = require("../middlewares/authenticate");
const upload = require("../middlewares/uploadImages");

const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validations/dataValidation");

router.post(
  "/register",
  registerValidation,
  upload.single("avatar"),
  AuthController.register
);
router.post("/login", loginValidation, AuthController.login);
router.post("/logout", authenticate, AuthController.logout);
router.post("/tokens", authenticate, AuthController.addToken);
router.delete("/tokens", authenticate, AuthController.removeToken);

router.post("/forgotPassword", AuthController.forgotPassword);
router.post("/checkPasswordCode", AuthController.checkPasswordCode);
router.post("/resetPassword", AuthController.resetPassword);

module.exports = router;
