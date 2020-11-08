const { pick } = require("lodash")

const handleBody = (body) => { 

  return {
    error: null,
    body: { ...pick(body, "name", "price","note") }
  }
}

module.exports = { handleBody }