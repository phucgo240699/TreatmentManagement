
const MedicineCategories = require("../models/medicinecategories");
const { isEmpty, pick } = require("lodash");
const { startSession } = require("mongoose");
const { commitTransactions, abortTransactions } = require("../services/transaction");

exports.create = async (req, res, next) => {
  let sessions = [];
  try {
    const name = req.body.name;
    // Check not enough property
    if (isEmpty(name)) {
      return res.status(406).json({
        success: false,
        error: "Not enough property"
      });
    }

    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    const newMedicineCategories = await MedicineCategories.create(
      [
        {
          ...pick(
            req.body,
            "name"
          )
        }
      ],
      { session: session }
    );

    if (isEmpty(newMedicineCategories)) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Created failed"
      });
    }

    // Check exist
    const oldMedicineCategories = await MedicineCategories.find({
      name: name,
      isDeleted: false
    },null,{session});


    if (oldMedicineCategories.length > 1) {
      await abortTransactions(sessions);
      return res.status(409).json({
        success: false,
        error: "This Medicine Category is already exist"
      });
    }


    // Done
    await commitTransactions(sessions);

    return res.status(200).json({
      success: true,
      data: newMedicineCategories[0]
    });
  } catch (error) {
    await abortTransactions(sessions);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    const medicinecategory = await MedicineCategories.findOne({ _id: req.params.id, isDeleted: false });

    if (isEmpty(medicinecategory)) {
      return res.status(404).json({
        success: false,
        error: "Not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: medicinecategory
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page); // page index
    const limit = Number(req.query.limit); // limit docs per page

    let medicinecategories;
    let query = {
      ...pick(req.body, "name"),
      isDeleted: false
    };

    if (!page || !limit) {
      medicinecategories = await MedicineCategories.find(query).select(
        "name"
      );
    } else {
      medicinecategories = await MedicineCategories.find(query)
        .select("name")
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: medicinecategories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res, next) => {
  let sessions = [];
  try {
    // Transactions
    let session = await startSession();
    session.startTransaction();
    sessions.push(session);

    const updateMedicineCategories = await MedicineCategories.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        ...pick(
          req.body,
          "name",
        )
      },
      { session, new: true }
    );

    if (isEmpty(updateMedicineCategories)) {
      await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Updated failed"
      });
    }

    // Check exist
    if (req.body.name) {
      let isChangeName = true;
      const [medicinecategories, beforeUpdated] = await Promise.all([
        MedicineCategories.find({ name: req.body.name, isDeleted: false },null,{session}),
        MedicineCategories.findOne({
          _id: req.params.id,
          isDeleted: false
        })
      ]);

      if (beforeUpdated.name === updateMedicineCategories.name) {
        isChangeName = false;
      }

      if (medicinecategories.length > 1 && isChangeName) {
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
      data: updateMedicineCategories
    });
  } catch (error) {
    await abortTransactions(sessions);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deletedMedicineCategories = await MedicineCategories.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (isEmpty(deletedMedicineCategories)) {
      return res.status(406).json({
        success: false,
        error: "Deleted failed"
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedMedicineCategories
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};