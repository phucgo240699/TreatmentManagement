const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const dotenv = require("dotenv");
const helmet = require('helmet');

dotenv.config()

const port = process.env.PORT || 3001

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

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
