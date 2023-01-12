
const express = require("express");

const app = express();
const cors = require("cors");
const db = require("./src/config/db");
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const loginController = require("./src/routes/login.route");
const homeController = require("./src/routes/home.route");

const filterController = require("./src/routes/filter.route");

app.use("/login", loginController);
app.use("/home", homeController);
app.use("/filter", filterController);

//------------------------------- Server connection ---------------------------------

app.listen(PORT, async () => {
    try {
        db.connect((error) => {
            if(error) {
                console.log("errorMessage :", "Error In Database Connection");
            }
            else {
                console.log("message :", "Database has connected successfully");
            }
            return;
        })
        console.log("message :", `Listening on port ${PORT}`);
    }
    catch(error) {
        console.log("errorMessage :", "Error in server connection");
    } 
})

module.exports = app;