
const db = require("../config/db");

const { body, validationResult } = require("express-validator")

const getAllData = async (req,res,next) => {
    try {
        db.connect(() => {
            db.query(`SELECT * FROM core_formdata`, (error, result, fields) => {
                if(error) {
                    return res.status(400).json({
                        errorMessage : error.message
                    })
                }
                
                if(result) {
                    return res.status(200).json({
                        message : result
                    })
                }
            })
        })
    }
    catch(error) {

    }
}

//--------------------------------------- Login Function ---------------------------------------
const loginUser = async (req,res,next) => {
    try {
        console.log("req :", req.body);
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(500).json({
                errorMessage : errors.array()
            })
        }
        return res.status(200).json({
            message : req.body,
            user : "WPP"
        })
    }
    catch(error) {
        return res.status(400).json({
            errorMessage : "Please Enter Valid Details"
        })

    }
}

module.exports = {
    getAllData,
    loginUser,
}