// inbuilt poackage
const path = require('path');
// Third Party Package
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const dotenv = require("dotenv");
const dbConnect = require("./src/config/db.config");
const cookieParser = require('cookie-parser');

// imports
const Routes = require("./src/router/index.router");
const uploadImage = require("./src/router/index.router");

dotenv.config();
dbConnect();
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
// var whitelist = ['http://localhost:8080']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions));
app.use((req, res, next) => {
  req.paths = path.resolve(__dirname)
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())

// middleware
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next();
});

// routes
app.use('/api', Routes);

app.listen(process.env.PORT, () =>{
  console.log(`Server Running on PORT ${process.env.PORT}`)
});