
const express = require("express");

const router = express.Router();
const { moduleFilter, marketFilter, dateFilter, filterAllData } = require("../controllers/filter.controller");
router.get("/module", moduleFilter);
router.get("/market", marketFilter);
router.get("/date", dateFilter);
router.post("/allData", filterAllData);

module.exports = router;



/*
Canonical Tags
Meta Title and Description
Update Copy
New Page Creation
News Tab
Image New
New Rich Text Component

Billboard New
Image Update
Update CTA
Schema Tags
Delete CTA
Remove Existing Component
["Meta Title and Description","Billboard Update","New Page Creation","Update Copy",
  "New Rich Text Component","Billboard New","Add CTA","News Tab","Remove Existing Component",
 "Image Update","Update CTA","Image New"]
*/