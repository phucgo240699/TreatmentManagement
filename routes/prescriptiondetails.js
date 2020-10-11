const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
const prescriptiondetailsController = require("../controllers/prescriptiondetails");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", authenticateToken, prescriptiondetailsController.create);
router.get("/:id", authenticateToken, prescriptiondetailsController.get);
router.post("/getAll", authenticateToken, prescriptiondetailsController.getAll);
router.put("/:id", authenticateToken, prescriptiondetailsController.update);
router.delete("/:id", authenticateToken, prescriptiondetailsController.delete);

module.exports = router;