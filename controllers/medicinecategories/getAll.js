const { pick } = require("lodash");
const MedicineCategories = require("../../models/medicinecategories");
const getAll = async (req, res) => {
    try {
        const page = Number(req.query.page); // page index
        const limit = Number(req.query.limit); // limit docs per page

        let medicinecategories;
        let query = {
            ...pick(req.body, "name"),
            isDeleted: false
        };

        if (!page || !limit) {
            medicinecategories = await MedicineCategories.find(query).select(
                "name"
            );
        } else {
            medicinecategories = await MedicineCategories.find(query)
                .select("name")
                .skip(limit * (page - 1))
                .limit(limit);
        }

        return res.status(200).json({ success: true, data: medicinecategories });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { getAll }