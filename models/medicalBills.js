const mongoose = require("mongoose")
const { schema } = require("./medicinecategories")

const Schema = mongoose.Schema

const MedicalBills = new Schema({
  totalPrice: {
    type: Number,
    required: true,
    index: true,
    default: 0
  },
  medicalrecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'medicalrecords',
    required: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("medicalbills", MedicalBills)