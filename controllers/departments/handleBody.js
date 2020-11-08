const { pick, isEmpty } = require("lodash")

const handleBody = (body) => { 
  if ((body.phoneNumber != null && isNaN(body.phoneNumber)) ||isEmpty(body.room) || isEmpty(body.floor) || isEmpty(body.name) || isEmpty(body.facultyId)) {
    return {
      error: "Invalid data"
    }
  }
  return {
    error: null,
    body: { ...pick(body, "name", 'floor','room','note','phoneNumber',"facultyId", "queue") }
  }
}

module.exports = { handleBody }