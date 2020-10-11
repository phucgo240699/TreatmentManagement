const router = require("express").Router();
const { authenticateToken } = require("../services/authenticationToken")
const precriptionbillsController = require("../controllers/prescriptionbills");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", authenticateToken, precriptionbillsController.create);
router.post("/review", authenticateToken, precriptionbillsController.review);
router.get("/:id", authenticateToken, precriptionbillsController.get);
router.post("/getAll", authenticateToken, precriptionbillsController.getAll);
// router.put("/:id", authenticateToken, precriptionbillsController.update);
// router.delete("/:id", authenticateToken, precriptionbillsController.delete);

module.exports = router;