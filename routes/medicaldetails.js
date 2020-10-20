const router = require("express").Router();

const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");


const { create } = require('../controllers/medicaldetails/create')
const { get } = require('../controllers/medicaldetails/get')
const { getAll } = require('../controllers/medicaldetails/getAll')
const { update } = require('../controllers/medicaldetails/update')
const { _delete } = require('../controllers/medicaldetails/delete')
// MedicineCategory
router.post("/",authenticateToken, create);
router.get("/:id",authenticateToken, get);
router.post("/getAll",authenticateToken, getAll);
router.put("/:id",authenticateToken, update);
router.delete("/:id",authenticateToken, _delete);

module.exports = router;