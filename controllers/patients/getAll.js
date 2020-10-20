const { pick } = require("lodash");
const Patient = require("../../models/patients");
const getAll = async (req, res) => {
  const page = Number(req.query.page); // page index
  const limit = Number(req.query.limit); // limit docs per page
  try {
    let patients;
    let query = {
      ...pick(req.body, "name", "birthday", "address", "phoneNumber", "job"),
      isDeleted: false
    };

    if (!page || !limit) {
      patients = await Patient.find(query)
        .select(
          "name birthday address phoneNumber job "
        );
    } else {
      patients = await Patient.find(query)
        .select(
          "name birthday address phoneNumber job"
        )
        .skip(limit * (page - 1))
        .limit(limit);
    }

    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getAll }