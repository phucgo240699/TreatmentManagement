const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/prescriptionbilldetails/create')
const { get } = require('../controllers/prescriptionbilldetails/get')
const { getAll } = require('../controllers/prescriptionbilldetails/getAll')
const { update } = require('../controllers/prescriptionbilldetails/update')
const { _delete } = require('../controllers/prescriptionbilldetails/delete')

// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router;