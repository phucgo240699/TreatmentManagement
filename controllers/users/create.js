const Users = require("../../models/users")
const { handleBody } = require("./handleBody")
const { startSession } = require('mongoose')
const bcrypt = require("bcrypt");
const { commitTransactions, abortTransactions } = require('../../services/transaction')

const create = async (req, res) => {
  let sessions = []
  try {
    const query = { 
      $or: [
        {phoneNumber: req.body.phoneNumber},
        {username: req.body.phoneNumber},
      ],
      isDeleted: false
    } // for oldDocs

    // Handle data
    const { error, body} = handleBody(req.body) // for newDoc
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

    // Hash password
    if (body.password != null) {
      body.password = await bcrypt.hashSync(body.password, 10);
    }

    // Access DB
    const [oldDocs, newDoc] = await Promise.all([
      Users.find(query),
      Users.create(
        [body],
        { session: session }
      )
    ])
    
    // Check duplicate
    if (oldDocs.length > 0) {
      await abortTransactions(sessions)
      return res.status(406).json({
        success: false,
        error: "Duplicate data"
      })
    }

    // Success
    await commitTransactions(sessions)
    return res.status(201).json({
      success: true,
      data: newDoc
    });
  } catch (error) {
    await abortTransactions(sessions)
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { create }