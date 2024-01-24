require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
 //for convert to json data
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// const corsoption = {
//     origin: "http://localhost:3000",
//     methods: "GET, POST, PATCH, DELETE, PUT, HEAD",
//     Credential: true,
// };

require("./db/connection");


app.use(require("./route/router"));

const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log(`Connecting the server on port ${PORT}`);
});