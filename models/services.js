const mongoose = require("mongoose")

const Schema = mongoose.Schema

const Services = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    index: true,
    default: 0
  },
  note:{
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
}, { timestamps: true })

module.exports = mongoose.model("services", Services)