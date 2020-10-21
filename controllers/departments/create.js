const Departments = require("../../models/departments")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')


const create = async (req, res) => {
  let sessions = []
  try {
    // Handle data
    const { error, body} = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }
    
    // Access DB
    const newDoc = await Departments.create(body)

    return res.status(200).json({
      success: true,
      data: newDoc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }