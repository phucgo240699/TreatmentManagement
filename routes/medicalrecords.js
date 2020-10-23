const router = require("express").Router();

const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");


const { create } = require('../controllers/medicalrecords/create')
const { get } = require('../controllers/medicalrecords/get')
const { getAll } = require('../controllers/medicalrecords/getAll')
const { update } = require('../controllers/medicalrecords/update')
const { _delete } = require('../controllers/medicalrecords/delete')
// MedicineCategory
router.post("/",authenticateToken, create);
router.get("/:id",authenticateToken, get);
router.post("/getAll",authenticateToken, getAll);
router.put("/:id",authenticateToken, update);
router.delete("/:id",authenticateToken, _delete);

module.exports = router;