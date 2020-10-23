const { pick } = require("lodash")

const handleBody = (body) => { 

  return {
    error: null,
    body: { ...pick(body, "medicalBillId", "prescriptionDetailId", "serviceIds") }
  }
}

module.exports = { handleBody }