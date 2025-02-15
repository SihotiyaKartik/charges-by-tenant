import { sendSuccess, sendError } from "../../../helpers/help";
// var constants = require("../../../helpers/constants");
// import connectMongoDb from "../../../db/connect";
// var config = require("../../../config/config")
import {auth} from "../../../utility/auth"
var Site = require("../../../models/Site");
const {isEmail, isMongoId} = require("validator")
// var History = require("../../../models/history");
// var Sites  = require("../../../models/Site")
var Charge = require("../../../models/Charge")
var Tenant  = require("../../../models/tenant")

export default async function handler(req, res){

    if(req.method == "POST"){
        var siteId = req.body.siteId
        var tenantId
        if(!siteId){
            return sendError(res, "siteId is not provided", 500)
        }

        if(!isMongoId(siteId)){
            return sendError(res, "invalid siteId", 500)
        }

        auth(req, res, (err, authData) => {
            if(err) return sendError(res, err.message, 500)
            tenantId = authData.id
        })

        Charge.find({site_id: siteId, tenant_id: tenantId}).populate('tenant_id', 'firstName lastName username email').exec(function(err,data){
            if(err) return sendError(res, err.message, 500)
            else{
                return sendSuccess(res, data)
            }
        })
          
    }

}