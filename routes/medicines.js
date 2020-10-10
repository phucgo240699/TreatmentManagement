const router = require("express").Router();

const medicinecategoriseController = require("../controllers/medicines");

// const { checkIsAdmin } = require("../services/checkAdmin");

// medicinecategorise
router.post("/", medicinecategoriseController.create);
router.get("/:id", medicinecategoriseController.get);
router.post("/getAll", medicinecategoriseController.getAll);
router.put("/:id", medicinecategoriseController.update);
router.delete("/:id", medicinecategoriseController.delete);

module.exports = router;