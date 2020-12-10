const express = require('express')
var path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const dotenv = require("dotenv");
const helmet = require('helmet');
var busboyBodyParser = require('busboy-body-parser');

const { authenticateToken } = require("./services/authenticationToken")
const app = express()
const webSocketServerPort = 3002;
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer(app);
//  server.listen(3001);
// console.log('listenning on Port 3002');

const clients = {};

const getUniqueID = ()=>{
  const s4 = () => Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

const wsServer = new webSocketServer({

  httpServer: server
});

wsServer.on('request',function (request){
  var userID = getUniqueID();
  // console.log((new Date()) + ' Received a nes connection from origin '+ request.origin+'.');
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  // console.log("connected: "+ userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message',function(message){
    if(message.type === 'utf8'){
      // console.log('Receive Message: ', message.utf8Data);
      // var o = JSON.parse(message.utf8Data);
      // console.log(o.msg)
      for(key in clients){
        clients[key].sendUTF(message.utf8Data);
        // console.log('sent Message to:', clients[key]);
      }
    }
  })
})

dotenv.config()

const port = process.env.PORT || 3001


app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(busboyBodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/images', express.static('images'));
// Routes
app.use("/api/medicine-categories", authenticateToken, require("./routes/medicinecategories"));
app.use("/api/medicines", authenticateToken, require("./routes/medicines"));
app.use("/api/patients", authenticateToken, require("./routes/patients"));
app.use("/api/prescriptions", authenticateToken, require("./routes/prescriptions"));
app.use("/api/prescription-details", authenticateToken, require("./routes/prescriptiondetails"));
app.use("/api/prescription-bills", authenticateToken, require("./routes/prescriptionbills"));
app.use("/api/prescription-bill-details", authenticateToken, require("./routes/prescriptionbilldetails"));
app.use("/api/medical-records",authenticateToken,require("./routes/medicalrecords"));
app.use("/api/medical-details",authenticateToken,require("./routes/medicaldetails"));
app.use("/api/users", require("./routes/users"))





app.use("/api/faculties", require("./routes/faculties"))
app.use("/api/departments", require("./routes/departments"))
app.use("/api/services", require("./routes/services"))
app.use("/api/medical-bills", require("./routes/medicalBills"))
app.use("/api/medical-bill-details", require("./routes/medicalBillDetails"))

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zhdhp.mongodb.net/dbOne?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
  )
  .then(result => {
    console.log("Database connected successfully");
    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });
    server.listen(3001, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error.message);
  });
// const express = require('express')
// var path = require('path');
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors")
// const dotenv = require("dotenv");
// const helmet = require('helmet');
// var busboyBodyParser = require('busboy-body-parser');

// const { authenticateToken } = require("./services/authenticationToken")
// const app = express()
// const server = require('http').createServer(app);
// const WebSocket = require('ws');
// console.log(server)
// const wss = new WebSocket.Server({ server:server });

// wss.on('connection', function connection(ws) {
//   console.log('A new client Connected!');
//   ws.send('Welcome New Client!');

//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);

//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
    
//   });
// });

// dotenv.config()

// const port = process.env.PORT || 3001


// app.use(helmet())
// app.use(cors())
// app.use(bodyParser.json())
// app.use(busboyBodyParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/api/images', express.static('images'));
// // Routes
// app.use("/api/medicine-categories", authenticateToken, require("./routes/medicinecategories"));
// app.use("/api/medicines", authenticateToken, require("./routes/medicines"));
// app.use("/api/patients", authenticateToken, require("./routes/patients"));
// app.use("/api/prescriptions", authenticateToken, require("./routes/prescriptions"));
// app.use("/api/prescription-details", authenticateToken, require("./routes/prescriptiondetails"));
// app.use("/api/prescription-bills", authenticateToken, require("./routes/prescriptionbills"));
// app.use("/api/prescription-bill-details", authenticateToken, require("./routes/prescriptionbilldetails"));
// app.use("/api/medical-records",authenticateToken,require("./routes/medicalrecords"));
// app.use("/api/medical-details",authenticateToken,require("./routes/medicaldetails"));
// app.use("/api/users", require("./routes/users"))





// app.use("/api/faculties", require("./routes/faculties"))
// app.use("/api/departments", require("./routes/departments"))
// app.use("/api/services", require("./routes/services"))
// app.use("/api/medical-bills", require("./routes/medicalBills"))
// app.use("/api/medical-bill-details", require("./routes/medicalBillDetails"))

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.zhdhp.mongodb.net/dbOne?retryWrites=true&w=majority`,
//     { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
//   )
//   .then(result => {
//     console.log("Database connected successfully");
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch(error => {
//     console.log(error.message);
//   });
