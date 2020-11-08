const MedicalDetails = require("../../models/medicaldetails");
const { isEmpty, pick } = require("lodash");
const { storeImage } = require("../../services/storeimage");
const create = async (req, res) => {
    try {
        const medicalrecordId = req.body.medicalrecordId;
        const doctorId = req.body.doctorId;
        const result = req.body.result;
        // Check not enough property
        if (isEmpty(medicalrecordId) || isEmpty(doctorId) || isEmpty(result)) {
            return res.status(406).json({
                success: false,
                error: "Not enough property"
            });
        }

        // create list more images
        var listmore = []
        console.log('a')
        if (!isEmpty(req.body.images)) {
            console.log('b')
            var listimages = req.body.images.split(',d');
            if (listimages instanceof Array) {
                for (var i = 0; i < listimages.length; i++) {
                    if (i != 0) {
                        listimages[i] = "d" + listimages[i];
                    }
                    listmore.push(storeImage(listimages[i]));
                }
            }
            else {
                listmore.push(storeImage(listimages));
            }
        }

        //Create
        const newMedicalDetails = await MedicalDetails.create(
            [
                {
                    ...pick(
                        req.body,
                        "medicalrecordId",
                        "doctorId",
                        "result",
                        "prescriptionId",
                        "note",
                        "medical_reason"
                    ),
                    images: listmore
                }
            ]
        );

        if (isEmpty(newMedicalDetails)) {
            return res.status(406).json({
                success: false,
                error: "Created failed"
            });
        }

        return res.status(200).json({
            success: true,
            data: newMedicalDetails[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { create }