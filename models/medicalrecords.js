const mongoose = require("mongoose");
const { schema } = require("./medicinecategories");

const Schema = mongoose.Schema;

const MedicalRecords = new Schema(
  {
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'patients',
        required:true,
        index:true
    },
    reason:{
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

module.exports = mongoose.model("medicalrecords", MedicalRecords);