
let pieChartValue;

const pieChartValueFn = (actionType,total,successfull,failed) => {
    
    console.log('total:', total)
    console.log('actionType:', typeof actionType)
    pieChartValue = {
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
        }
    }

    if(actionType === "") {
        console.log('actionType:', actionType)
        return pieChartValue;
    }
    else {
        pieChartValue[actionType].total += total
        console.log('pieChartValue:', pieChartValue)
        return pieChartValue;
    }
}



module.exports = pieChartValueFn