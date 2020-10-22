const router = require('express').Router()
const { isAdmin } = require("../services/checkAdmin")
const { authenticateToken } = require("../services/authenticationToken")

const { create } = require('../controllers/services/create')
const { get } = require('../controllers/services/get')
const { getAll } = require('../controllers/services/getAll')
const { update } = require('../controllers/services/update')
const { _delete } = require('../controllers/services/delete')

router.post("/", authenticateToken, isAdmin, create)
router.get("/:id", authenticateToken, get)
router.get("/", authenticateToken, getAll)
router.put("/:id", authenticateToken, isAdmin, update)
router.delete("/:id", authenticateToken, isAdmin, _delete)

module.exports = router