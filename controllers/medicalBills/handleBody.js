const { pick } = require("lodash")

const handleBody = (body) => {

  return {
    error: null,
    body: { ...pick(body, "totalPrice", "medicalrecordId") }
  }
}

module.exports = { handleBody }