const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/prescriptiondetails/create')
const { get } = require('../controllers/prescriptiondetails/get')
const { getAll } = require('../controllers/prescriptiondetails/getAll')
const { update } = require('../controllers/prescriptiondetails/update')
const { _delete } = require('../controllers/prescriptiondetails/delete')
// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router;