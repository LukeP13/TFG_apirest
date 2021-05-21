const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const upload = require("../middlewares/uploadImages");

/**** Routes ****/ //user

router.get("/", UserController.getUser);

router.patch("/", upload.single("avatar"), UserController.update);
router.patch("/password", UserController.passwordUpdate);

router.delete("/", UserController.remove);

//EXPORT
module.exports = router;
