const { pick } = require("lodash")

const handleBody = (body) => { 

  return {
    error: null,
    body: { ...pick(body, "medicalBillId", "note", "serviceId") }
  }
}

module.exports = { handleBody }