const router = require("express").Router();

const { authenticateToken } = require("../services/authenticationToken")
const medicinecategoriesController = require("../controllers/medicinecategories");

// const { checkIsAdmin } = require("../services/checkAdmin");

// MedicineCategory
router.post("/",authenticateToken, medicinecategoriesController.create);
router.get("/:id",authenticateToken, medicinecategoriesController.get);
router.post("/getAll",authenticateToken, medicinecategoriesController.getAll);
router.put("/:id",authenticateToken, medicinecategoriesController.update);
router.delete("/:id",authenticateToken, medicinecategoriesController.delete);

module.exports = router;