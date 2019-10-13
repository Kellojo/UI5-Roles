

const express = require("express")
const cors = require('cors')

/* Routes */
const usersRoute = require("./routes/Users")

/* Initilize our app and the firebase admin sdk */
var app = express();

app.use(cors())

/* Use our created routes */
app.use("/users", usersRoute);




module.exports = app;