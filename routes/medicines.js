const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
const medicinesController = require("../controllers/medicines");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", authenticateToken, medicinesController.create);
router.get("/:id", authenticateToken, medicinesController.get);
router.post("/getAll", authenticateToken, medicinesController.getAll);
router.put("/:id", authenticateToken, medicinesController.update);
router.delete("/:id", authenticateToken, medicinesController.delete);

module.exports = router;