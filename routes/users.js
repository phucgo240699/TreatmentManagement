const router = require('express').Router()
const { isAdmin } = require("../../services/checkAdmin")

const { create } = require('../controllers/users/create')
const { get } = require('../controllers/users/get')
const { getAll } = require('../controllers/users/getAll')
const { update } = require('../controllers/users/update')
const { _delete } = require('../controllers/users/delete')
const { login } = require('../controllers/users/login')

router.post("/", isAdmin, create)
router.get("/:id", get)
router.get("/", isAdmin, getAll)
router.put("/:id", isAdmin, update)
router.delete("/:id", isAdmin, _delete)
router.post("/login", login)

module.exports = router