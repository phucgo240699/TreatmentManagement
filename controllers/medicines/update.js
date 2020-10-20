const { pick } = require("lodash");
const { startSession } = require("mongoose");
const { abortTransactions, commitTransactions } = require("../../services/transaction");
const Medicine = require("../../models/medicines");

const update = async (req, res) => {
  let sessions = [];
  try {
    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    const updateMedicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        ...pick(
          req.body,
          "name",
          "price",
          "quantity",
          "brand",
          "medicineId",
          "unit"
        )
      },
      { session, new: true }
    );

    if (isEmpty(updateMedicine)) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Updated failed"
      });
    }

    if (Number(req.body.quantity) < 0) {
      await abortTransactions(session);
      return res.startSession(406), json({
        success: false,
        error: "Quantity is invalid"
      })
    }

    if (Number(req.body.price) < 0) {
      await abortTransactions(session);
      return res.startSession(406), json({
        success: false,
        error: "Price is invalid"
      })
    }

    // Check exist
    if (req.body.name) {
      let isChangeName = true;
      const [medicines, beforeUpdated] = await Promise.all([
        Medicine.find({ name: req.body.name, isDeleted: false }, null, { session }),
        Medicine.findOne({
          _id: req.params.id,
          isDeleted: false
        })
      ]);

      if (beforeUpdated.name === updateMedicine.name) {
        isChangeName = false;
      }

      if (medicines.length > 1 && isChangeName) {
        await abortTransactions(sessions);
        return res.status(409).json({
          success: false,
          error: "This name is already exist"
        });
      }
    }

    // Done
    await commitTransactions(sessions);

    return res.status(200).json({
      success: true,
      data: updateMedicine
    });
  } catch (error) {
    await abortTransactions(sessions);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { update }