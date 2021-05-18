const express = require("express");
const router = express.Router();

const RevisionController = require("../controllers/RevisionController");

/**** Routes ****/

router.patch("/:revId", RevisionController.patchRevision);

// EXPORT
module.exports = router;
