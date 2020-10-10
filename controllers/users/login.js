const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("../../models/users");

const login = async (req, res) => {
  try {
    // Check username is exist
    const user = await Users.findOne({ username: req.body.username , isDeleted: false }).select(
      "password _id"
    );
    if (user == null) {
      return res.json({ success: false, error: "Login failed" });
    }
    
    // Compare password of user above
    const isLogin = await bcrypt.compareSync(req.body.password, user.password);
    if (!isLogin) {
      return res.json({ success: false, error: "Login failed" });
    }
    
    // Generate token
    const token = jwt.sign(
      { username: user._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "14d" }
    );
    
    return res.status(200).json({ success: isLogin, data: token });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { login }