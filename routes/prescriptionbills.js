const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")

// const { checkIsAdmin } = require("../services/checkAdmin");
const { create } = require('../controllers/prescriptionbills/create')
const { get } = require('../controllers/prescriptionbills/get')
const { getAll } = require('../controllers/prescriptionbills/getAll')
// const { _delete } = require('../controllers/prescriptionbills/delete')
const { review } = require('../controllers/prescriptionbills/review')
// medicinecategorise
router.post("/", authenticateToken, create);
router.post("/review", authenticateToken, review);
router.get("/:id", authenticateToken, get);
router.post("/getAll", authenticateToken, getAll);
// router.put("/:id", authenticateToken, precriptionbillsController.update);
// router.delete("/:id", authenticateToken, precriptionbillsController.delete);

module.exports = router;