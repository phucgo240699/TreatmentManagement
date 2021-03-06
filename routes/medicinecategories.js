const router = require("express").Router();

const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");


const { create } = require('../controllers/medicinecategories/create')
const { get } = require('../controllers/medicinecategories/get')
const { getAll } = require('../controllers/medicinecategories/getAll')
const { update } = require('../controllers/medicinecategories/update')
const { _delete } = require('../controllers/medicinecategories/delete')
// MedicineCategory
router.post("/",authenticateToken, create);
router.get("/:id",authenticateToken, get);
router.post("/getAll",authenticateToken, getAll);
router.put("/:id",authenticateToken, update);
router.delete("/:id",authenticateToken, _delete);

module.exports = router;