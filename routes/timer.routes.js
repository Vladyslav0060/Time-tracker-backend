const Router = require("express");
const timerController = require("../controllers/timer.controller");
const router = new Router();

router.get("/time", timerController.getTime);
router.post("/time", timerController.createActivity);
router.get("/activity/:id", timerController.getActivities);
module.exports = router;
