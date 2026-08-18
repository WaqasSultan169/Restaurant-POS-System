const express = require("express");
const { getTables, addTable, updateTable } = require("../controllers/tableController");
const { isVerifiedUser } = require("../middlewares/tokenVerfication");
const router = express.Router();

router.route("/").post(isVerifiedUser, addTable);
router.route("/").get(isVerifiedUser, getTables);
router.route("/:id").put(isVerifiedUser, updateTable);

module.exports = router;