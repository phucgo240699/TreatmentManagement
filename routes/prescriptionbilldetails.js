const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/Prescriptionbilldetails/create')
const { get } = require('../controllers/Prescriptionbilldetails/get')
const { getAll } = require('../controllers/Prescriptionbilldetails/getAll')
const { update } = require('../controllers/Prescriptionbilldetails/update')
const { _delete } = require('../controllers/Prescriptionbilldetails/delete')

// medicinecategorise
router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, _delete);

module.exports = router;