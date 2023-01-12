
const db = require("../config/db");

const { commonFilter, calculateInterval } = require("../utils/commonFilter.utils");

const moduleFilter = async (req,res,next) => {
    try {
        let date = new Date();
        let data = [];
        db.connect(() => {
            // db.query(`SELECT status, created_at, jira_id, job_number, action_type FROM core_formdata WHERE created_at >= "${startDate}" AND created_at <= "${tillDate}"`, (error, result, fields) => { 
            db.query(`SELECT jira_id, job_number, status, created_at, page_url, action_type FROM core_formdata WHERE created_at >= "${date.getFullYear()-1+"-"+date.getMonth()+"-"+date.getDate()}" AND created_at <= "${date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()}"`, (error, result, fields) => {
               if(error) {
                    return res.status(500).json({
                        errorMessage : error.message
                    })
                } 
                if(result) {
                for(let i = 0; i<result.length; i++) {
                    result[i]["action_type"] = "Image Update";
                    data.push(result[i]);
                }

                let filterData = commonFilter(data);
                return res.status(200).json({
                    message : result,
                    resultData : filterData
                })
               }
            })
        })
    }

    catch(error) {
        res.status(500).json({
            errorMessage : error.message
        })
    }
}

const marketFilter = async (req,res,next) => {
    try {
        let date = new Date();
        let data = [];
        db.connect(() => {
            // db.query(`SELECT status, created_at, jira_id, job_number, action_type FROM core_formdata WHERE created_at >= "${startDate}" AND created_at <= "${tillDate}"`, (error, result, fields) => { 
            db.query(`SELECT jira_id, job_number, status, created_at, page_url, action_type FROM core_formdata WHERE created_at >= "${date.getFullYear()-1+"-"+date.getMonth()+"-"+date.getDate()}" AND created_at <= "${date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()}"`, (error, result, fields) => {
               if(error) {
                    return res.status(500).json({
                        errorMessage : error.message
                    })
                } 
                if(result) {

                for(let i = 0; i<result.length; i++) {
                    let market = result[i]["page_url"].split("/ford/")[1];
                    
                    // console.log('market:', market)
                    let marketValue = "";
                    if(market) {
                        for(let j = 0; j<market.length; j++) {
                            // console.log('market[j]:', market[j])
                            if(market[j] === "/") {
                                break;
                            }
                            marketValue += market[j];
                        }
                    }
                        
                    // console.log('marketValue:', marketValue)
                    if(marketValue === "nz") {
                        // console.log('result[i]:', result[i])
                        data.push(result[i]);
                    }
                }

                console.log('data:', data)
                let filterData = commonFilter(data);
                return res.status(200).json({
                    message : result,
                    message : data,
                    resultData : filterData
                })
               }
            })
        })
    }
    catch(error) {
        return res.status(500).json({

            errorMessage : error.message
        })
    }
}
const dateFilter = async (req,res,next) => {
    try {
        let date = new Date();

        let data = [];
        let startDate = "2021-01-01";

        let tillDate = "2022-10-31";
        db.connect(() => {
            // db.query(`SELECT status, created_at, jira_id, job_number, action_type, page_url FROM core_formdata WHERE created_at >= "${startDate}" AND created_at <= "${tillDate}"`, (error, result, fields) => { 
            // db.query(`SELECT jira_id, job_number, status, created_at, page_url, action_type FROM core_formdata WHERE created_at >= "${date.getFullYear()-1+"-"+date.getMonth()+"-"+date.getDate()}" AND created_at <= "${date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()}"`, (error, result, fields) => {
            //    if(error) {
            //         return res.status(500).json({
            //             errorMessage : error.message
            //         })
            //     } 

            //     if(result) {
                    let startSplit = startDate.split("-");
                    console.log('startSplit:', startSplit)
                    let tillSplit = tillDate.split("-");
                    console.log('tillSplit:', tillSplit)
                    let yearDiff = Math.abs(Number(tillSplit[0])-Number(startSplit[0]));
                    console.log('yearDiff:', yearDiff)
                    let monthDiff = Math.abs(Number(tillSplit[1])-Number(startSplit[1]));
                    let dateDiff = Math.abs(Number(tillSplit[2])-Number(startDate[2]));

                    if(yearDiff >= 1) {
                        let i = Number(startSplit[0]);
                        let diffData = [];
                        while(i < Number(tillSplit[0])) {
                            console.log('i1:', i)
                            db.query(`SELECT jira_id, job_number, status, created_at, page_url, action_type FROM core_formdata WHERE created_at >= "${i+"-"+Number(startSplit[1])+"-"+Number(startSplit[2])}" AND created_at <= "${i+1+"-"+Number(tillSplit[1])+"-"+Number(tillSplit[2])}"`, (error, result, fields) => { 
                                if(error) {
                                    return res.status(500).json({
                                        errorMessage : error.message
                                    })
                                }
                                if(result) {
                                    // console.log('result:', result)
                                    // data.push([...result]);
                                    // console.log('data:', data)
                                    diffData.push(result);
                                    console.log('diffData:', diffData)

                                    console.log("i :",i);
                                }
                            })
                            i++
                        }
                        console.log('diffData:', diffData)
                    }

                    console.log('data:', data)
                    // console.log('result:', result)
                    // let filterData = commonFilter(result);
                    return res.status(200).json({
                        // message : result,
                        message : data,
                        // resultData : filterData
                    })
            //    }
            // })
        })
    }
    catch(error) {
        return res.status(500).json({
            
            errorMessage : error.message
        })
    }
}

//-------------------------------- Filter Function For Market, Module And Date ------------------------
const filterAllData = async (req,res,next) => {
    try {
        console.log('req:', req.body);
        let d1 = req.body.startDate.split("/").map(Number);
        let d2 = req.body.endDate.split("/").map(Number);
        let startDate = `${d1[2]}-${d1[0] < 10 ? "0"+d1[0] : d1[0]}-${d1[1] < 10 ? "0"+d1[1] : d1[1]}`
        console.log('startDate:', startDate)
        let tillDate = `${d2[2]}-${d2[0] < 10 ? "0"+d2[0] : d2[0]}-${d2[1] < 10 ? "0"+d2[1] : d2[1]}`
        console.log('tillDate:', tillDate)
        let date1 = new Date(startDate);
        let date2 = new Date(tillDate);

        let time_difference = date2.getTime() - date1.getTime();
        let days_difference = time_difference / (1000 * 60 * 60 * 24);
        // console.log('days_difference:', days_difference);
        let resData = [];
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
        db.connect(() => {
            db.query(`SELECT status, created_at, jira_id, job_number, action_type, page_url FROM core_formdata WHERE created_at >= "${startDate}" AND created_at <= "${tillDate}"`, (error, result, fields) => {
                if(error) {
                    return res.status(500).json({
                        errorMessage : error.message
                    })
                }
                let resultData;
                if(req.body.market === "All" && req.body.action === "All") {
                    resultData = calculateInterval(result, days_difference, startDate, tillDate, "", "refresh", "");
                }
                else if(req.body.market !== "All" && req.body.action === "All") {
                    // console.log('req.body.market:', req.body.market);
                    for(let i = 0; i<result.length; i++) {
                        // console.log('result[i]:', result[i])

                        let market = result[i]["page_url"].split("/ford/")[1];
                        // console.log('market:', market)
                        let marketValue = "";
                        if(market) {
                            for(let j = 0; j<market.length; j++) {
                                // console.log('market[j]:', market[j])
                                if(market[j] === "/") {
                                    break;
                                }
                                marketValue += market[j];
                            }
                        }
                        // console.log('marketValue:', marketValue)
                        if(marketValue === req.body.market && (result[i]["status"] === "Successful" || result[i]["status"] === "Failed")) {
                            // console.log('result[i]:', result[i])
                            resData.push(result[i]);
                            if(result[i]["action_type"] === "Canonical Tags") {
                                actionObject["Canonical_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Meta Title and Description") {
                                actionObject["Meta_Title_and_Description"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update Copy") {
                                actionObject["Update_Copy"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Page Creation") {
                                actionObject["New_Page_Creation"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "News Tab") {
                                actionObject["News_Tab"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image New") {
                                actionObject["Image_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Rich Text Component") {
                                actionObject["New_Rich_Text_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard New") {
                                actionObject["Billboard_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image Update") {
                                actionObject["Image_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update CTA") {
                                actionObject["Update_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Schema Tags") {
                                actionObject["Schema_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Delete CTA") {
                                actionObject["Delete_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Remove Existing Component") {
                                actionObject["Remove_Existing_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard Update") {
                                actionObject["Billboard_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Add CTA") {
                                actionObject["Add_CTA"].push(result[i]);
                            }
                        }
                    }
                    // console.log('resData:', resData)

                    resultData = calculateInterval(resData, days_difference, startDate, tillDate, "skip", "", actionObject);
                }
                else if(req.body.market === "All" && req.body.action !== "All") {
                    console.log('req.body.action:', req.body.action)
                    for(let i = 0; i<result.length; i++) {
                        if(result[i]["action_type"] === req.body.action && (result[i]["status"] === "Successful" || result[i]["status"] === "Failed")) {
                            resData.push(result[i]);
                        } 
                        if(result[i]["status"] === "Successful" || result[i]["status"] === "Failed") {
                            if(result[i]["action_type"] === "Canonical Tags") {
                                actionObject["Canonical_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Meta Title and Description") {
                                actionObject["Meta_Title_and_Description"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update Copy") {
                                actionObject["Update_Copy"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Page Creation") {
                                actionObject["New_Page_Creation"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "News Tab") {
                                actionObject["News_Tab"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image New") {
                                actionObject["Image_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Rich Text Component") {
                                actionObject["New_Rich_Text_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard New") {
                                actionObject["Billboard_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image Update") {
                                actionObject["Image_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update CTA") {
                                actionObject["Update_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Schema Tags") {
                                actionObject["Schema_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Delete CTA") {
                                actionObject["Delete_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Remove Existing Component") {
                                actionObject["Remove_Existing_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard Update") {
                                actionObject["Billboard_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Add CTA") {
                                actionObject["Add_CTA"].push(result[i]);
                            }
                        }
                    }

                    // console.log('resData:', resData)
                    resultData = calculateInterval(resData, days_difference, startDate, tillDate, "skip", "", actionObject);
                }
                else if(req.body.market !== "All" && req.body.action !== "All") {
                    // console.log('req.body.market:', req.body.market)
                    // console.log('req.body.action:', req.body.action)
                    for(let i = 0; i<result.length; i++) {
                        let market = result[i]["page_url"].split("/ford/")[1];
                        // console.log('market:', market)
                        let marketValue = "";
                        if(market) {
                            for(let j = 0; j<market.length; j++) {
                                // console.log('market[j]:', market[j])
                                if(market[j] === "/") {
                                    break;
                                }
                                marketValue += market[j];
                            }
                        }
                        if(result[i]["action_type"] === req.body.action && marketValue === req.body.market && (result[i]["status"] === "Successful" || result[i]["status"] === "Failed")) {
                            resData.push(result[i]);
                        } 
                        if(marketValue === req.body.market && (result[i]["status"] === "Successful" || result[i]["status"] === "Failed")) {
                            if(result[i]["action_type"] === "Canonical Tags") {
                                actionObject["Canonical_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Meta Title and Description") {
                                actionObject["Meta_Title_and_Description"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update Copy") {
                                actionObject["Update_Copy"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Page Creation") {
                                actionObject["New_Page_Creation"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "News Tab") {
                                actionObject["News_Tab"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image New") {
                                actionObject["Image_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "New Rich Text Component") {
                                actionObject["New_Rich_Text_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard New") {
                                actionObject["Billboard_New"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Image Update") {
                                actionObject["Image_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Update CTA") {
                                actionObject["Update_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Schema Tags") {
                                actionObject["Schema_Tags"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Delete CTA") {
                                actionObject["Delete_CTA"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Remove Existing Component") {
                                actionObject["Remove_Existing_Component"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Billboard Update") {
                                actionObject["Billboard_Update"].push(result[i]);
                            }
                            else if(result[i]["action_type"] === "Add CTA") {
                                actionObject["Add_CTA"].push(result[i]);
                            }
                        }
                    }
                    // console.log('resData:', resData)
                    resultData = calculateInterval(resData, days_difference, startDate, tillDate, "skip", "", actionObject);
                }
                if(result) {
                    return res.status(200).json({
                        resultData : resultData
                        // message : result
                    })
                }
            } )
        })
    }
    catch(error) {
        return res.status(500).json({
            errorMessage : error.message
        })
    }
}
module.exports = {
    moduleFilter,
    marketFilter,
    dateFilter,
    filterAllData
}