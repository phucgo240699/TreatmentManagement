const { pick, isEmpty } = require("lodash");
// const { startSession } = require("mongoose");
// const { abortTransactions, commitTransactions } = require("../../services/transaction");
const MedicalDetails = require("../../models/medicaldetails");
const {storeImage} = require("../../services/storeimage");
const update = async (req, res) => {
  let sessions = [];
  try {
    // Transactions
    // let session = await startSession();
    // session.startTransaction();
    // sessions.push(session);

    // handle images
    var images = []
    if (!isEmpty(req.body.images)) {
        var listimages = req.body.images.split(',d');
        if (listimages instanceof Array) {
            for (var i = 0; i < listimages.length; i++) {
                if(i!=0)
                {
                    listimages[i]="d"+listimages[i];
                }
                images.push(storeImage(listimages[i]));
            }
        }
        else {
            images.push(storeImage(listimages));
        }
    }
    if (!isEmpty(req.body.oldimages)) {
        var listimages =  req.body.oldimages.split(',');
        if (listimages instanceof Array) {
            for (var i = 0; i < listimages.length; i++) {
                images.push(listimages[i]);
            }
        }
        else {
            images.push(listimages.toString());
        }
    }


    const updateMedicalDetails = await MedicalDetails.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        ...pick(
          req.body,
          "medicalrecordId",
          "doctorId",
          "result",
          "prescriptionId"
        ),
        images:images
      },
      {  new: true }
    );

    if (isEmpty(updateMedicalDetails)) {
      // await abortTransactions(sessions);
      return res.status(406).json({
        success: false,
        error: "Updated failed"
      });
    }
    // Done
    // await commitTransactions(sessions);

    return res.status(200).json({
      success: true,
      data: updateMedicalDetails
    });
  } catch (error) {
    // await abortTransactions(sessions);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { update }