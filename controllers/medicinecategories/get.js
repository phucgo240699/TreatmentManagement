const { isEmpty } = require("lodash");
const Medicinecategories = require("../../models/medicinecategories");

const get = async (req, res) => {
    try {
        const medicinecategory = await Medicinecategories.findOne({ _id: req.params.id, isDeleted: false });

        if (isEmpty(medicinecategory)) {
            return res.status(406).json({
                success: false,
                error: "Not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: medicinecategory
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { get }