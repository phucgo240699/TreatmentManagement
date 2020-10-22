const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { checkRoles } = require("../services/checkRoles")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/departments/create')
const { get } = require('../controllers/departments/get')
const { getAll } = require('../controllers/departments/getAll')
const { update } = require('../controllers/departments/update')
const { _delete } = require('../controllers/departments/delete')
const { addPatients } = require('../controllers/departments/queue/addPatients')
const { getQueue } = require('../controllers/departments/queue/getQueue')
const { removePatient } = require('../controllers/departments/queue/removePatient')
const { cleanPatientQueue } = require('../controllers/departments/queue/clean')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

router.put("/:id/add-patients", authenticateToken, addPatients)
router.get("/:id/patient-queue", authenticateToken, getQueue)
router.delete("/:id/remove-patient/:patientId", authenticateToken, checkRoles(req.user.role, ["admin", "doctor", "staff"]), removePatient)
router.delete("/:id/clean-patient-queue", authenticateToken, isAdmin, cleanPatientQueue)

module.exports = router