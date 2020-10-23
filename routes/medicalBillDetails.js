const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/medicalBillDetails/create')
const { get } = require('../controllers/medicalBillDetails/get')
const { getAll } = require('../controllers/medicalBillDetails/getAll')
const { _delete } = require('../controllers/medicalBillDetails/delete')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, getAll)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router