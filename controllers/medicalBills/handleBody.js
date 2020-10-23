const { pick } = require("lodash")

const handleBody = (body) => { 

  return {
    error: null,
    body: { ...pick(body, "totalPrice") }
  }
}

module.exports = { handleBody }