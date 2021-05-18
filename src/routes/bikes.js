const express = require("express");
const router = express.Router();

const BikeController = require("../controllers/BikeController");
const RevisionRouter = require("./revisions");
const Middlewares = require("../middlewares/bikes");

/**** Routes ****/
router.get("/", BikeController.getBikes);
router.get("/:id", BikeController.getBike);

router.post("/", BikeController.postBike);

router.patch("/:id", BikeController.patchBike);

router.delete("/:id", BikeController.deleteBike);

router.use("/:id/revisions", Middlewares.mapBikeId, RevisionRouter);

// EXPORT
module.exports = router;
