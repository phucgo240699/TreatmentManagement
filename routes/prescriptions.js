const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
const prescriptionsController = require("../controllers/prescriptions");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", authenticateToken, prescriptionsController.create);
router.get("/:id", authenticateToken, prescriptionsController.get);
router.post("/getAll", authenticateToken, prescriptionsController.getAll);
router.put("/:id", authenticateToken, prescriptionsController.update);
router.delete("/:id", authenticateToken, prescriptionsController.delete);

module.exports = router;