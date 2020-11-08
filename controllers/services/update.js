const Services = require("../../models/services")
const { handleBody } = require('./handleBody')
const { startSession } = require('mongoose')
const { commitTransactions, abortTransactions } = require('../../services/transaction')

const update = async (req, res) => {
  let sessions = []
  try {
    const queryOld = {
      name: req.body.name,
      price: req.body.price,
      note: req.body.note,
      isDeleted: false
    } // for oldDocs

    const queryUpdate = { _id: req.params.id, isDeleted: false }

    // Handle data
    const { error, body } = handleBody(req.body) // for newDoc
    if (error) {
      return res.status(406).json({
        success: false,
        error: error
      })
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    // Access DB
    const updated = await Services.findOneAndUpdate(
      queryUpdate,
      body,
      { session, new: true }
    )

    // Check duplicate
    const oldDocs = await Services.find(queryOld, null, { session })
    if (oldDocs.length > 1) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // Updated Successfully
    await commitTransactions(sessions)
    return res.status(200).json({
      success: true,
      data: updated
    })
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { update }