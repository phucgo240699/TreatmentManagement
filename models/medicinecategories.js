const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MedicineCategories = new Schema(
  {
    name:{
        type: String,
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

module.exports = mongoose.model("medicinecategories", MedicineCategories);