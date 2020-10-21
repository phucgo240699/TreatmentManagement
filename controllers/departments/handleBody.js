const { pick } = require("lodash")

const handleBody = (body) => { 

  return {
    error: null,
    body: { ...pick(body, "name", "facultyId", "queue") }
  }
}

module.exports = { handleBody }