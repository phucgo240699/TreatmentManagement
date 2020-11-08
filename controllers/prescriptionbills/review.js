const { isEmpty, pick } = require("lodash");
const Prescriptiondetail = require("../../models/prescriptiondetails");
const review = async (req, res) => {
    try {
        const prescriptionId = req.body.prescriptionId;
        const pharmacistId = req.body.pharmacistId;
        // Check not enough property
        if (isEmpty(prescriptionId) || isEmpty(pharmacistId)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        var into_money = 0;
        var list = await Prescriptiondetail.find({ isDeleted: false, prescriptionId: prescriptionId })
            .select(
                "medicineId quantity"
            )
            .populate({ path: "medicineId", select: ["price", "name", "quantity", "unit"] });

        var list_err = [];

        list.forEach((value) => {
            if (value.medicineId.quantity < value.quantity) {
                var temp_err = "Thuốc " + value.medicineId.name + " chỉ còn " + value.medicineId.quantity + " " + value.medicineId.unit;
                list_err.push(temp_err);
            }
            into_money += value.medicineId.price * value.quantity;
        })

        if (list_err.length > 0) {
            return res.status(406).json({
                success: false,
                err: list_err
            });
        }

        //Create review
        const newPrescriptionbill =
        {
            ...pick(
                req.body,
                "pharmacistId"
            ),
            into_money: into_money
        }
        // Done
        return res.status(200).json({
            success: true,
            data: newPrescriptionbill
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { review }