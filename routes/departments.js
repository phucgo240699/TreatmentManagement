const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/departments/create')
const { get } = require('../controllers/departments/get')
const { getAll } = require('../controllers/departments/getAll')
const { getQueue } = require('../controllers/departments/getQueue')
const { update } = require('../controllers/departments/update')
const { _delete } = require('../controllers/departments/delete')
const { addPatients } = require('../controllers/departments/addPatients')

router.post("/", authenticateToken, isAdmin, create)
router.put("/:id/add-patients", authenticateToken, addPatients)
router.get("/:id/patient-queue", getQueue)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router