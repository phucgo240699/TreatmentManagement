const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const dotenv = require("dotenv");
const helmet = require('helmet');


const { authenticateToken } = require("./services/authenticationToken")

dotenv.config()

const port = process.env.PORT || 3001

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/medicine-categories", authenticateToken, require("./routes/medicinecategories"));
app.use("/medicines", authenticateToken, require("./routes/medicines"));
app.use("/patients", authenticateToken, require("./routes/patients"));
app.use("/prescriptions", authenticateToken, require("./routes/prescriptions"));
app.use("/prescription-details", authenticateToken, require("./routes/prescriptiondetails"));
app.use("/prescription-bills", authenticateToken, require("./routes/prescriptionbills"));
app.use("/users", require("./routes/users"))





app.use("/faculties", require("./routes/faculties"))
app.use("/departments", require("./routes/departments"))
app.use("/services", require("./routes/services"))
app.use("/medical-bills", require("./routes/medicalBills"))
app.use("/medical-bill-details", require("./routes/medicalBillDetails"))

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zhdhp.mongodb.net/dbOne?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
  )
  .then(result => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error.message);
  });
