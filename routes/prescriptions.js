const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/prescription/create')
const { get } = require('../controllers/prescription/get')
const { getAll } = require('../controllers/prescription/getAll')
const { update } = require('../controllers/prescription/update')
const { _delete } = require('../controllers/prescription/delete')
// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router