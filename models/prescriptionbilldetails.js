const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Prescriptionbilldetails = new Schema(
    {
        prescriptionbillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "prescriptionbills",
            index: true,
            required: true
        },
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "medicines",
            index: true,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("prescriptionbilldetails", Prescriptionbilldetails);