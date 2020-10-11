const { pick } = require("lodash")

const handleBody = (body) => { 
  if (body.phoneNumber != null && isNaN(body.phoneNumber)) {
    return {
      error: "Phone Number only contains numbers"
    }
  }
  return {
    error: null,
    body: { ...pick(body, 
      "name", 
      "birthday", 
      "address", 
      "phoneNumber", 
      "departmentId", 
      "username", 
      "password",
      "role") 
    }
  }
} // for newDoc

module.exports = { handleBody }