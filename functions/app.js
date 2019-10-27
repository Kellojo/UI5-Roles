

const express = require("express")
const cors = require('cors')();
const cookieParser = require('cookie-parser')();



const AuthController = require("./controller/Auth");


/* Routes */
const usersRoute = require("./routes/Users")
const rolesRoute = require("./routes/Roles")

/* Initilize our app and the firebase admin sdk */
var app = express();

/* Apply Middleware */
app.use(cors);
app.use(cookieParser);
app.use(AuthController.validateFirebaseIdToken);

/* Use our created routes */
app.use("/users", usersRoute);
app.use("/roles", rolesRoute);




module.exports = app;