const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
const patientsController = require("../controllers/patients");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", authenticateToken, patientsController.create);
router.get("/:id", authenticateToken, patientsController.get);
router.post("/getAll", authenticateToken, patientsController.getAll);
router.put("/:id", authenticateToken, patientsController.update);
router.delete("/:id", authenticateToken, patientsController.delete);

module.exports = router;