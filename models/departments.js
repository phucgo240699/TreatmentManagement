const mongoose = require("mongoose")

const Schema = mongoose.Schema

const Departments = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  room:{
    type: String,
    required: true,
    index:true
  },
  floor:{
    type: String,
    required: true,
    index:true
  },
  facultyId: {
    type: Schema.Types.ObjectId,
    ref: "faculties",
    required: true,
    index: true
  },
  phoneNumber:{
    type: String,
    required: true,
    index: true
  },
  note:{
    type: String,
    index: true
  },
  queue: [{
    type: Schema.Types.ObjectId,
    ref: "medicalrecords"
  }],
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, { timestamps: true })

module.exports = mongoose.model("departments", Departments)