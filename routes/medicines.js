const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/medicines/create')
const { get } = require('../controllers/medicines/get')
const { getAll } = require('../controllers/medicines/getAll')
const { update } = require('../controllers/medicines/update')
const { _delete } = require('../controllers/medicines/delete')
// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router;