const router = require('express').Router()

const { create } = require('../controllers/users/create')
const { get } = require('../controllers/users/get')
const { getAll } = require('../controllers/users/getAll')
const { update } = require('../controllers/users/update')
const { _delete } = require('../controllers/users/delete')
const { login } = require('../controllers/users/login')

router.post("/", create)
router.get("/:id", get)
router.get("/", getAll)
router.put("/:id", update)
router.delete("/:id", _delete)
router.post("/login", login)

module.exports = router