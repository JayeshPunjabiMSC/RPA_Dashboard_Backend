
const db = require("../config/db")

const moment = require("moment");

// ------------------------------------------ Pie Chart Drill Down Value --------------------------------
let pieChartValue = {
    Canonical_Tags : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Meta_Title_and_Description : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Update_Copy : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    New_Page_Creation : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    News_Tab : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Image_New : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    New_Rich_Text_Component : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Billboard_New : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Image_Update : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Update_CTA : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Schema_Tags : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Delete_CTA : {
        total : 0,
        successfull : 0,
        failed : 0,
    },
    Remove_Existing_Component : {
        total : 0,
        successfull : 0,
        failed : 0,
    },

    Billboard_Update : {
        total : 0,
        successfull : 0,
        failed : 0
    },
    Add_CTA : {
        total : 0,
        successfull : 0,
        failed : 0
    }
}

//----------------------------------- Function for calculating data for Successful, Failed, Request, Job_Number -----------------------
const commonFilter = (result) => {
    let status = {
        Successful : 0,
        Failed : 0,
    };
    
    let requestAndJobCount = {
        Request : 0,
        Job : 0
    }
    let requestAndJob = {};

    for(let i = 0; i<result.length; i++) {
        // console.log(result[i]);
        if(requestAndJob[result[i]["jira_id"]] === undefined) {
            requestAndJob[result[i]["jira_id"]] = [];
        }

        let dataArray = requestAndJob[result[i]["jira_id"]];
        let value = result[i]["job_number"];
        if(!dataArray.includes(value) && (result[i]["status"] === "Successful" || result[i]["status"] === "Failed")) {
            if(result[i]["status"] === "Failed") {
                status["Failed"] += 1
            }
            else {
                status["Successful"] += 1
            }
            dataArray.push(value);
        }
    }
    // console.log('requestAndJob:', requestAndJob)
    for(key in requestAndJob) {
        requestAndJobCount["Job"] += requestAndJob[key].length;
        requestAndJobCount["Request"] += 1;
    }
    return {

        status,
        requestAndJobCount,
        requestAndJob
    }
}

let total = {
    successfulTotal : 0,
    failedTotal : 0,

    requestTotal : 0,
    jobTotal : 0,
    manHoursTotal : 0,
    startDate : "",
    endDate : ""
}

//------------------------------------- Function for calculating data for month wise --------------------
const monthWiseData = (data, allDate) => {
    // console.log('allDate according to month wise:', allDate)

    // console.log('data:', data)
    let finalResult = [];
    let i = 0;
    let j = 0;
    let day = 0;
    let dataPacked = [];
    let startDate = "";
    let endDate = "";

    let month = "";
    let manHours;
    total = {
        successfulTotal : 0,
        failedTotal : 0,
    
        requestTotal : 0,
        jobTotal : 0,
        manHoursTotal : 0,
        startDate : "",
        endDate : ""
    }
    let start = allDate[0];
    let end = allDate[allDate.length-1];
    total["startDate"] = moment.utc(start).format("DD-MM-YYYY");
    total["endDate"] = moment.utc(end).format("DD-MM-YYYY");
    const manHoursCalculate = (data) => {
        day = Number(month);
        if(data.length === 0) {
            finalResult.push({
                manHours : 0,
                successful : 0,
                failed : 0,
                job_Id : 0,

                job_Number : 0,
                day : `${day === 1 ? "Jan" : day === 2 ? "Feb" : day === 3 ? "Mar" : day === 4 ? "Apr" : day === 5 ? "May" : day === 6 ? "Jun" : day === 7 ? "Jul" : day === 8 ? "Aug" : day === 9 ? "Sep" : day === 10 ? "Oct" : day === 11 ? "Nov" : "Dec"}`,
                startDate : startDate,
                endDate : endDate
            })
        }
        else {
            let result = commonFilter(dataPacked);
            manHours = Number((result.status.Successful*2.7).toFixed(2));
            // console.log('manHours:', manHours)
            // console.log('manHours:', typeof manHours)
            total["successfulTotal"] += result.status.Successful

            total["failedTotal"] += result.status.Failed

            total["requestTotal"] += result.requestAndJobCount.Request
            total["jobTotal"] += result.requestAndJobCount.Job
            total["manHoursTotal"] += Number((manHours).toFixed(2));
            // console.log('total["manHoursTotal"]:', total["manHoursTotal"])
            // console.log('total["manHoursTotal"]:', typeof total["manHoursTotal"])

            finalResult.push({
                manHours : manHours,
                successful : result.status.Successful,
                failed : result.status.Failed,
                job_Id : result.requestAndJobCount.Request,
                job_Number : result.requestAndJobCount.Job,
                day : `${day === 1 ? "Jan" : day === 2 ? "Feb" : day === 3 ? "Mar" : day === 4 ? "Apr" : day === 5 ? "May" : day === 6 ? "Jun" : day === 7 ? "Jul" : day === 8 ? "Aug" : day === 9 ? "Sep" : day === 10 ? "Oct" : day === 11 ? "Nov" : "Dec"}`,
                startDate : startDate,
                endDate : endDate
            })
        }
    }
    while(allDate.length !== 0) {
        let date = allDate[0];
        // console.log('date:', date)
        let accDate = moment.utc(date).format("YYYY-MM-DD");
        // console.log('accDate:', accDate)
        // console.log('accDate:', accDate)
        // let month = accDate.split("-")[1];

        // console.log('month:', month)
        // break;
        let firstDate = "";

        if(i >= data.length) {
            firstDate = "noDate";
        }
        else {
            firstDate = data[i]["created_at"].split(" ")[0];
        }

        if(j >= 31 && (month === "01" || month === "03" || month === "05" || month === "07" || month === "08" || month === "10" || month === "12")) {
            // console.log('j:', j)
            // console.log("31 days");
            // console.log('month:', month)
            manHoursCalculate(dataPacked)
            // console.log('finalResult:', finalResult)
            j = 0;
            dataPacked = [];
        }

        else if(j >= 30 && (month === "04" || month === "06" || month === "09" || month === "11")) {
            // console.log('j:', j)
            // console.log("30 days");
            // console.log('month:', month)
            manHoursCalculate(dataPacked)
            // console.log('finalResult:', finalResult)
            j = 0;
            dataPacked = [];
        }
        
        else if(j >= 28 && (month === "02")) {
            // console.log('j:', j)
            // console.log("28 days");
            // console.log('month:', month)
            manHoursCalculate(dataPacked)
            // console.log('finalResult:', finalResult)
            j = 0;
            dataPacked = [];
        }

        if(j === 0) {
            startDate = accDate;
        }
        if(accDate !== firstDate) {
            j++;
            // console.log('j:', j)
            endDate = accDate;
            month = accDate.split("-")[1];
            // console.log('month:', month)

            allDate.shift();
            let currentDate = allDate[0];
            let currentD = moment.utc(currentDate).format("YYYY-MM-DD");    
            if(allDate.length === 0) {
                manHoursCalculate(dataPacked);
                // console.log('finalResult:', finalResult)
                j = 0;
                dataPacked = [];
                continue;
            }
            if((j < 31 || j < 30 || j < 28) && currentD.split("-")[1] !== month) {
                manHoursCalculate(dataPacked);
                j = 0;
                dataPacked = [];
            }
        }
        else if(accDate === firstDate) {
            dataPacked.push(data[i]);
            i++;
        }
    }
    // console.log('finalResult:', finalResult)
    // status["manHoursTotal"]

    total = {...total, manHoursTotal : (total["manHoursTotal"]).toFixed(2)}
    console.log('total:', total)
    
    // console.log('total["manHoursTotal"]:', total.manHoursTotal.toFixed(2));
    return {

        finalResult : finalResult,
        status : "Months",

        total : total,
        // data : data
    }
}



//---------------------------------- Function for calculating data for week wise -----------------------
const weekWiseData = (data, allDate) => {
    // console.log('allDate of week:', allDate)
    // console.log('data:', data)
    let finalResult = [];
    let i = 0;
    let j = 0;
    let day = 0;
    let lastDate = "";
    let dataPacked = [];
    let startDate = "";

    let endDate = "";
    let manHours;
    total = {
        successfulTotal : 0,
        failedTotal : 0,
    
        requestTotal : 0,
        jobTotal : 0,
        manHoursTotal : 0,
        startDate : "",
        endDate : ""
    }
    let start = allDate[0];
    let end = allDate[allDate.length-1];
    total["startDate"] = moment.utc(start).format("DD-MM-YYYY");

    total["endDate"] = moment.utc(end).format("DD-MM-YYYY");
    while(allDate.length !== 0) {
        let date = allDate[0];
        // console.log('date:', date)
        let accDate = moment.utc(date).format("YYYY-MM-DD");
        // console.log('accDate:', accDate)
        let firstDate = "";
        // console.log('firstDate:', firstDate)
        if(i >= data.length) {

            firstDate = "noDate";
        }
        else {
            firstDate = data[i]["created_at"].split(" ")[0];
        }
        // console.log('firstDate:', firstDate)
        if(j >= 7 || (allDate.length === 0 && j < 7)) {
            day++;
            // console.log('dataPacked:', dataPacked)

            if(dataPacked.length === 0) {
                finalResult.push({
                    manHours : 0,
                    successful : 0,
                    failed : 0,
                    job_Id : 0,
                    job_Number : 0,
                    day : day,
                    startDate : startDate,
                    endDate : endDate
                })
            }
            else {
                let result = commonFilter(dataPacked);
                manHours = Number((result.status.Successful*2.7).toFixed(2));

                total["successfulTotal"] += result.status.Successful
                total["failedTotal"] += result.status.Failed
                total["requestTotal"] += result.requestAndJobCount.Request
                total["jobTotal"] += result.requestAndJobCount.Job
                
                total["manHoursTotal"] += manHours;
                finalResult.push({
                    manHours : manHours,
                    successful : result.status.Successful,
                    failed : result.status.Failed,
                    job_Id : result.requestAndJobCount.Request,
                    job_Number : result.requestAndJobCount.Job,
                    day : day,
                    startDate : startDate,
                    endDate : endDate
                })
            }
            j = 0;
            dataPacked = [];
        }

        if(j === 0) {
            startDate = accDate;
        }
        if(accDate !== firstDate) {
            j++;
            // console.log('j:', j)
            endDate = accDate;
            allDate.shift();
            if(allDate.length === 0) {

            day++;
                // console.log('dataPacked:', dataPacked)
                if(dataPacked.length === 0) {
                    finalResult.push({
                        manHours : 0,
                        successful : 0,
                        failed : 0,
                        job_Id : 0,
                        job_Number : 0,

                        day : day,
                        startDate : startDate,
                        endDate : endDate
                    })
                }
                else {
                    let result = commonFilter(dataPacked);
                    manHours = Number((result.status.Successful*2.7).toFixed(2));

                    total["successfulTotal"] += result.status.Successful
                    total["failedTotal"] += result.status.Failed
                    total["requestTotal"] += result.requestAndJobCount.Request
                    total["jobTotal"] += result.requestAndJobCount.Job
                    
                    total["manHoursTotal"] += manHours;
                    finalResult.push({

                        manHours : manHours,
                        successful : result.status.Successful,
                        failed : result.status.Failed,
                        job_Id : result.requestAndJobCount.Request,
                        job_Number : result.requestAndJobCount.Job,
                        day : day,
                        startDate : startDate,
                        endDate : endDate
                    })
                }
                j = 0;
                dataPacked = [];
            }
        }
        else if(accDate === firstDate) {
            dataPacked.push(data[i]);
            // console.log('dataPacked:', dataPacked)
            i++;
        }
    }
    // console.log('finalResult:', finalResult)
    total = {...total, manHoursTotal : (total["manHoursTotal"]).toFixed(2)}
    return {
        finalResult : finalResult,
        status : "Weeks",
        total : total
    }
}


//---------------------------- Function for calculating data for day wise --------------------------
const dayWiseData = (data, allDate) => {
    // console.log('allDate according to day wise:', allDate)
    // console.log('data:', data)
    let finalResult = [];
    let i = 0;
    let lastDate = ""

    let dataPacked = [];
    let manHours;

    total = {
        successfulTotal : 0,
        failedTotal : 0,
    
        requestTotal : 0,
        jobTotal : 0,
        manHoursTotal : 0,
        startDate : "",
        endDate : ""
    }
    let start = allDate[0];
    let end = allDate[allDate.length-1];
    total["startDate"] = moment.utc(start).format("DD-MM-YYYY");
    
    total["endDate"] = moment.utc(end).format("DD-MM-YYYY");
    while(allDate.length !== 0) {
        let date = allDate[0];
        // console.log('date:', date)
        // let accDate = new Date(date);

        let accDate = moment.utc(date).format("YYYY-MM-DD");
        // console.log('accDate:', accDate)
        // console.log('accDate:', accDate)
        // console.log('accDate:', accDate.getFullYear(), accDate.getMonth(), accDate.getDate())
        let day = accDate.split("-")[2];
        let firstDate = "";
        if(i >= data.length) {
            firstDate = "noDate";
        }
        else {
            firstDate = data[i]["created_at"].split(" ")[0];
        }
        // console.log('firstDate:', firstDate)
        if(lastDate !== "" && dataPacked.length !== 0 && accDate !== firstDate) {
            
            let result = commonFilter(dataPacked);
            manHours = Number((result.status.Successful*2.7).toFixed(2));
            total["successfulTotal"] += result.status.Successful

            total["failedTotal"] += result.status.Failed
            total["requestTotal"] += result.requestAndJobCount.Request
            total["jobTotal"] += result.requestAndJobCount.Job
            total["manHoursTotal"] += manHours;
            finalResult.push({
                manHours : manHours,
                successful : result.status.Successful,
                failed : result.status.Failed,
                job_Id : result.requestAndJobCount.Request,
                job_Number : result.requestAndJobCount.Job,
                day : day,
                date : accDate
            })
            // console.log('result:', result)
            allDate.shift();
            dataPacked = [];
            lastDate = "";
        }
        else if(accDate !== firstDate) {
            finalResult.push({
                manHours : 0,
                successful : 0,
                failed : 0,

                job_Id : 0,
                job_Number : 0,
                day : day,
                date : accDate
            })
            // console.log('finalResult:', finalResult)
            allDate.shift();
        }
        else if(accDate === firstDate) {
            dataPacked.push(data[i]);
            lastDate = accDate;
            i++;
        }
    }
    // console.log('finalResult:', finalResult)

    total = {...total, manHoursTotal : (total["manHoursTotal"]).toFixed(2)}
    return {
        finalResult : finalResult,
        status : "Days",
        total : total
    }
}

//--------------------------------- Function for finding all date between range ------------------------
function getAllDate(d1, d2) {
    // console.log('d1:', d1)
    // console.log('d2:', d2)
    let startDate = new Date(d1);
    let endDate = new Date(d2);

    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
}

//------------------------------ Find the days interval --------------------------------
const calculateInterval = (data, days, startDate, endDate, statusSkip, refreshStatus, actionObj) => {

    console.log('refreshStatus:', refreshStatus)
    let actionObject = {
        Canonical_Tags : [],

        Meta_Title_and_Description : [],
        Update_Copy : [],
        New_Page_Creation : [],
        News_Tab : [],
        Image_New : [],
        New_Rich_Text_Component : [],
        Billboard_New : [],
        Image_Update : [],
        Update_CTA : [],
        Schema_Tags : [],

        Delete_CTA : [],
        Remove_Existing_Component : [],
        Billboard_Update : [],
        Add_CTA : [],
    }
    // console.log('endDate:', endDate)
    // console.log('startDate:', startDate)
    // console.log('days:', days)
    // console.log('data:', data)
    let start = startDate.split("-");
    // console.log('start:', start)
    let end = endDate.split("-");
    // console.log('end:', end)
    let allDate = getAllDate(startDate, endDate);
    // console.log('allDate:', allDate);
    let successfulAndFailedData = [];
    if(statusSkip === "skip") {
        // console.log('statusSkip:', statusSkip)
        // pieChartValueFn("Meta_Title_and_Description",1,0,0);
        // pieChartValue["Meta_Title_and_Description"].total += 1;
        successfulAndFailedData = [...data];
        if(actionObj !== "no") {

            for(key in actionObj) {
                // console.log('key:', key)
                let keyValue = key;
                // console.log('keyValue:', keyValue)
                // console.log('actionObject[key]:', actionObject[key])
                
                let result = commonFilter(actionObj[key]);
                // console.log('result:', result)
                // console.log('pieChartValue[key].total:', pieChartValue[keyValue])
                // console.log('pieChartValue[key].total:', pieChartValue[key])
                pieChartValue[keyValue]["total"] = result.requestAndJobCount.Job
                pieChartValue[keyValue]["successfull"] = result.status.Successful
                pieChartValue[keyValue]["failed"] = result.status.Failed
            }
        }
        
            // console.log('successfulAndFailedData:', successfulAndFailedData)
    }
    else {
        // pieChartValueFn("Canonical_Tags",1,0,0)
        // console.log('statusSkip:', statusSkip)
        // pieChartValue["Canonical_Tags"].total += 1;
        if(refreshStatus === "refresh") {
            console.log('refreshStatus:', refreshStatus)
            for(let i = 0; i<data.length; i++) {
                if((data[i]["status"] === "Successful" || data[i]["status"] === "Failed") && data[i]["created_at"] !== undefined) {

                    successfulAndFailedData.push(data[i]);
                    if(data[i]["action_type"] === "Canonical Tags") {
                        actionObject["Canonical_Tags"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Meta Title and Description") {
                        actionObject["Meta_Title_and_Description"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Update Copy") {
                        actionObject["Update_Copy"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "New Page Creation") {
                        actionObject["New_Page_Creation"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "News Tab") {
                        actionObject["News_Tab"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Image New") {
                        actionObject["Image_New"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "New Rich Text Component") {
                        actionObject["New_Rich_Text_Component"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Billboard New") {
                        actionObject["Billboard_New"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Image Update") {
                        actionObject["Image_Update"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Update CTA") {
                        actionObject["Update_CTA"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Schema Tags") {
                        actionObject["Schema_Tags"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Delete CTA") {
                        actionObject["Delete_CTA"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Remove Existing Component") {
                        actionObject["Remove_Existing_Component"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Billboard Update") {
                        actionObject["Billboard_Update"].push(data[i]);
                    }
                    else if(data[i]["action_type"] === "Add CTA") {
                        actionObject["Add_CTA"].push(data[i]);
                    }
                }
            }
            console.log('refreshStatus:', refreshStatus)
            for(key in actionObject) {
                // console.log('key:', key)
                let keyValue = key;
                // console.log('keyValue:', keyValue)
                // console.log('actionObject[key]:', actionObject[key])

                let result = commonFilter(actionObject[key]);
                // console.log('result:', result)
                // console.log('pieChartValue[key].total:', pieChartValue[keyValue])
                // console.log('pieChartValue[key].total:', pieChartValue[key])
                pieChartValue[keyValue]["total"] = result.requestAndJobCount.Job
                pieChartValue[keyValue]["successfull"] = result.status.Successful
                pieChartValue[keyValue]["failed"] = result.status.Failed
            }
            console.log('pieChartValue:', pieChartValue)
            // console.log('refreshStatus:', refreshStatus)
        }
        else {
            // console.log("Not Come")
            for(let i = 0; i<data.length; i++) {
                if((data[i]["status"] === "Successful" || data[i]["status"] === "Failed") && data[i]["created_at"] !== undefined) {
                    successfulAndFailedData.push(data[i]);
                }
            }
        }
    }


    // console.log('actionObject:', actionObject)
    // console.log('successfulAndFailedData:', successfulAndFailedData)

    //------------------------- Function calling for month wise data calculation -----------------------
    if(days > 90) {
        let result = monthWiseData(successfulAndFailedData, allDate)
        // return successfulAndFailedData;
        // let res = pieChartValueFn("",0,0,0);
        // console.log('res:', res)
        console.log("pieChartValue :", pieChartValue);
        return { 
            result,
            pieChartValue
        };
    }
    //------------------------- Function calling for week wise data calculation -----------------------
    else if(days > 30) {
        let result = weekWiseData(successfulAndFailedData, allDate);
        console.log("pieChartValue :", pieChartValue);
        // return successfulAndFailedData;
        
        // let res = pieChartValueFn("",0,0,0);
        // console.log('res:', res)
        return {
            result,

            pieChartValue
        };
    }
    //------------------------- Function calling for day wise data calculation -----------------------
    else {
        let result = dayWiseData(successfulAndFailedData, allDate)
        
        console.log("pieChartValue :", pieChartValue);
        // let res = pieChartValueFn("",0,0,0);
        // console.log('res:', res)
        if(refreshStatus === "refresh") {

        }
        return {
            result,
            pieChartValue
        };
    }
}
module.exports = {
    commonFilter,
    calculateInterval
}