

const express = require("express")

/* Routes */
const usersRoute = require("./routes/Users")

/* Initilize our app and the firebase admin sdk */
var app = express();

/* Use our created routes */
app.use("/users", usersRoute);




module.exports = app;