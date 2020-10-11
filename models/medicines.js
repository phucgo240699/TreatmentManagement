const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Medicines = new Schema(
    {
        medicinecategoriesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "medicinecategories",
            index: true,
            required: true
        },
        name: {
            type: String,
            index: true,
            required: true
        },
        unit:{
            type: String,
            index: true,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true,
            index:true
        },
        brand:{
            type:String,
            required:true,
            index:true
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

module.exports = mongoose.model("medicines", Medicines);