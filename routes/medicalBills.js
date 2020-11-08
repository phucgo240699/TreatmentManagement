const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/medicalBills/create')
const { get } = require('../controllers/medicalBills/get')
const { getAll } = require('../controllers/medicalBills/getAll')
const { _delete } = require('../controllers/medicalBills/delete')

router.post("/", authenticateToken, create)
router.get("/:id", authenticateToken, get)
router.post("/getAll", authenticateToken, getAll)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router