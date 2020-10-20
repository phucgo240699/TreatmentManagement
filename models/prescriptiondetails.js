const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Prescriptiondetails = new Schema(
    {
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "prescriptions",
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

module.exports = mongoose.model("prescriptiondetails", Prescriptiondetails);