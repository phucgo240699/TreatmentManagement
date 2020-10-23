const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/patients/create')
const { get } = require('../controllers/patients/get')
const { getAll } = require('../controllers/patients/getAll')
const { update } = require('../controllers/patients/update')
const { _delete } = require('../controllers/patients/delete')
// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router;