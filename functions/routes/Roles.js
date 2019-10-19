/**
 * Handles /roles/ requests
 * 
 * @author Daniel Fritz 
 */

const admin = require("firebase-admin")
const express = require("express")
var router = express.Router();

const RolesController = require("../controller/Roles");



/**
 * Get's all roles
 * @public 
 */
router.get("/", async (request, response, next) => {
    response.json({
        allRoles: await RolesController.getAllRoles()
    });
});


module.exports = router;