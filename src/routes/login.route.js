
const express = require("express");

const { body, validationResult } = require("express-validator");

const router = express.Router();
const { getAllData, loginUser } = require("../controllers/login.controller");

//-------------------------- Validation for login credentials ----------------------------
router.post("/user", 
body("email").isEmail().custom( async (value) => {
    console.log('value:', value)
    if(!value.match("rpa@wundermanthompson.com")) {

        throw new Error("Credentials wrong try again");

    }
    return true;
}),

body("password").not().isEmpty().withMessage("Password must be required").custom( async (value) => {
    // const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
    // if(!value.match(passw)) {
    //     throw new Error("Password must be strong");
    // }
    if(!value.match("Welcome@123")) {
        throw new Error("Credentials wrong try again");
    }
    return true;
}),
loginUser);
router.get("/allData", getAllData);

module.exports = router;