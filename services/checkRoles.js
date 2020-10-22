const checkRoles = (userRole, validRole) => {
  if (validRole.includes) {
    next()
  }
  else{ 
    return res.json({ success: false, error: "Not allow" });
  }
};

module.exports = { checkRoles };
