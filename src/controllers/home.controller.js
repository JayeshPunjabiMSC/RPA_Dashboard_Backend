
const db = require("../config/db");

const { commonFilter, calculateInterval } = require("../utils/commonFilter.utils");

//-------------------------------- Fetching Data For Landing Page --------------------------------
const getAllData = async (req,res,next) => {
    try {
        let date = new Date();
        // let startDate = "2021-2-1";
        // let d1 = "2022-01-01".split("-").map(Number);
        // console.log('date.getMonth():', date.getMonth())
        let month = date.getMonth()+1;

        let d1 = `${date.getFullYear()-1+"-"+month+"-"+date.getDate()}`.split("-").map(Number);
        // console.log('d1:', d1)
        // let d2 = "2022-02-01".split("-").map(Number);
        let d2 = `${date.getFullYear()+"-"+month+"-"+date.getDate()}`.split("-").map(Number);   
        // console.log('d2:', d2)
        let startDate = `${d1[0]}-${d1[1] < 10 ? "0"+d1[1] : d1[1]}-${d1[2] < 10 ? "0"+d1[2] : d1[2]}`
        // console.log('startDate:', startDate)
        let tillDate = `${d2[0]}-${d2[1] < 10 ? "0"+d2[1] : d2[1]}-${d2[2] < 10 ? "0"+d2[2] : d2[2]}`
        // let tillDate = "2021-1-5";

        // console.log('tillDate:', tillDate)
        let date1 = new Date(startDate);
        let date2 = new Date(tillDate);
        var time_difference = date2.getTime() - date1.getTime();
        var days_difference = time_difference / (1000 * 60 * 60 * 24);
        // console.log('days_difference:', days_difference);
        db.connect(() => {
            // db.query(`SELECT jira_id, job_number, status, created_at, page_url, action_type FROM core_formdata WHERE created_at >= "${date.getFullYear()-1+"-"+date.getMonth()+"-"+date.getDate()}" AND created_at <= "${date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()}"`, (error, result, fields) => {
            db.query(`SELECT status, created_at, jira_id, job_number, action_type FROM core_formdata WHERE created_at >= "${startDate}" AND created_at <= "${tillDate} AND form_env = 'Production'"`, (error, result, fields) => {
                if(error) {
                    return res.status(400).json({
                        errorMessage : error.message
                    })
                }
                const resultData = calculateInterval(result, days_difference, startDate, tillDate, "", "refresh", "no");
                if(result) {
                    return res.status(200).json({
                        resultData : resultData
                    })
                }
            })
        })
    }
    catch(error) {
        return res.status(500).json({
            error : "Home error",
            errorMessage : error.message
        })
    }
}

module.exports = {
    getAllData,
}