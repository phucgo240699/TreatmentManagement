const router = require("express").Router();

const medicinecategoryController = require("../controllers/medicinecategories");

// const { checkIsAdmin } = require("../services/checkAdmin");

// MedicineCategory
router.post("/", medicinecategoryController.create);
router.get("/:id", medicinecategoryController.get);
router.post("/getAll", medicinecategoryController.getAll);
router.put("/:id", medicinecategoryController.update);
router.delete("/:id", medicinecategoryController.delete);

module.exports = router;