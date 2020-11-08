const mongoose = require("mongoose");
const { schema } = require("./medicinecategories");

const Schema = mongoose.Schema;

const MedicalDetails = new Schema(
    {
        medicalrecordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'patients',
            required: true,
            index: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true
        },
        medical_reason: {
            type: String,
            index: true
        },
        note: {
            type: String,
            index: true
        },
        images: {
            type: Array,
            index: true
        },
        result: {
            type: String,
            required: true,
            index: true
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

module.exports = mongoose.model("medicaldetails", MedicalDetails);