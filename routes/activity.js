//'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));

var http = require('https');


exports.logExecuteData = [];

function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl
  });
  console.log("body: " + util.inspect(req.body));
  console.log("headers: " + req.headers);
  console.log("trailers: " + req.trailers);
  console.log("method: " + req.method);
  console.log("url: " + req.url);
  console.log("params: " + util.inspect(req.params));
  console.log("query: " + util.inspect(req.query));
  console.log("route: " + req.route);
  console.log("cookies: " + req.cookies);
  console.log("ip: " + req.ip);
  console.log("path: " + req.path);
  console.log("host: " + req.host);
  console.log("fresh: " + req.fresh);
  console.log("stale: " + req.stale);
  console.log("protocol: " + req.protocol);
  console.log("secure: " + req.secure);
  console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

  console.log("5 -- For Edit");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Edited: "+req.body.inArguments[0]);    

  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  logData(req);
  res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {

  console.log("5 -- For Save");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Saved: "+req.body.inArguments[0]);

  // Data from the req and put it in an array accessible to the main app.
  console.log('Data from the req:' + req.body);
  logData(req);
  res.send(200, 'Save');
};

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

exports.execute = function (req, res) {

  console.log("5 -- For Execute");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");

  console.log(req.body);
  console.log('Request Body:-' + JSON.stringify(req.body));
  console.log("Executed1: " + req.body.inArguments[0]);

  var requestBody = req.body.inArguments[0];
  console.log('requestBody:' + requestBody);

  const phone = requestBody.phoneNumber;
  console.log('Phone:' + phone);
  const email = requestBody.email;
  //const storeName = requestBody.storeName;





  let emailCode;

  console.log('email: --> ', email);

  switch (email) {
    case 'CONF':
      emailCode = "a94a5487de7f3af75b3474dfcda6f501";  
      break;
    case 'SHIP':
      emailCode = "5b643a7051ead66d83867a7a6f9bb591"; 
      break;
    case 'REFUND':
      emailCode = "e7bd46aa09f2dcff5bde88a858f06061";
      break;
    case 'PUDELAY':
      emailCode = "177556d040b33c79babe628bfa716313"; 
      break;
    case 'PUREADY':
      emailCode = "db1ec7402fb94fa63badf951342314ec"; 
      break;
    case 'PUREM':
      emailCode = "335e257d678f80164423e07fa866da76"; 
      break;
    case 'PUCONF':
      emailCode = "371613ce6604752a237c6c8fd2cf150e"; 
      break;
    case 'CNCLNOINV':
      emailCode = "554e9e79a0aa504f8dafdc95105f9553"; 
      break;
    case 'CNCLCUST':
      emailCode = "f6f3b77782c267d4da70bddab82ba0f7"; 
      break;
    case 'SignUp':
      emailCode = "01e9626fcdb86e1c8274197ec35b87f3"; 
      break;
    case 'Inventory':
      emailCode = "217becea0a0a85f1fe8487dc904fbb10"; 
      break;
  }

  let trackingNumber;
  var axios = require('axios');
  //var parseXML = require('xml-parse-from-string');
  const request = require('request');
  const crypto = require('crypto-js');


  var xml2js = require('xml2js');
  const URL = require('url');

  console.log('Traking:' + trackingNumber + "");

  function authorize() {
    var signatureArray = []
    var timeStamp = Math.floor(Date.now() / 1000)
    var nonce = (Math.random().toString(36).substr(2))
    var apiId = process.env.API_ID
    var apiSecret = process.env.API_SECRET
    signatureArray.push(timeStamp, nonce, apiId)
    var signatureString = signatureArray.sort().join('')
    var hmac = crypto.HmacSHA256(signatureString, apiSecret)
    var authorization = 'gt_id=' + apiId + ',timestamp=' + timeStamp + ',nonce=' + nonce + ',signature=' + hmac
    return authorization
  }

  var auth = authorize();
  console.log('Email Code:-' + emailCode);
  let data;

  
  if (emailCode == '5b643a7051ead66d83867a7a6f9bb591') { //SHIP    

    let xmlLineItem1 = requestBody.LineItemXML;
    let newstring = xmlLineItem1.replace(/&lt;/g, '<');
    let xmlLineItem = newstring.replace(/&gt;/g, '>');
    console.log('XMLTEST=' + xmlLineItem);

    //Getting traking number from XML
    var parser = new xml2js.Parser();
    parser.parseString(xmlLineItem, function (err, result) {
      console.log('Error=' + err);
      console.log('XML Result');
      console.log(result.ROOT.LineItem);
      var gettingTrakingURL = result.ROOT.LineItem[0].product;

      console.log('Track ' + gettingTrakingURL[0].shipmentTrackingCode);
      trackingNumber = gettingTrakingURL[0].shipmentTrackingCode;

    });

    data = JSON.stringify({
      'phone': phone,
      'modeId': emailCode,
      'arguments': {
        'orderNumber': requestBody.orderID,
        'trackingNumber': (trackingNumber.toString()).trim()
      },
    });
  }
  else if (emailCode == '335e257d678f80164423e07fa866da76' || emailCode == 'db1ec7402fb94fa63badf951342314ec') {   //PUREADY & PUREM
    data = JSON.stringify({
      'phone': phone,
      'modeId': emailCode,
      'arguments': {
        'orderNumber': requestBody.orderID,
        'storeName': requestBody.storeName
      },
    });
  }
  else if (emailCode == '01e9626fcdb86e1c8274197ec35b87f3') { //For SignUp
    data = JSON.stringify({
      'phone': phone,
      'modeId': emailCode,
      'arguments': {
      },
    });
  }
  else if (emailCode == '217becea0a0a85f1fe8487dc904fbb10') { // For Inventory
    var productURL = (`https://cn.mcmworldwide.com/zh_CN/${requestBody.SKU}.html`).toString();

    data = JSON.stringify({
      'phone': phone,
      'modeId': emailCode,
      'arguments': {
        'productName': requestBody.productName,
        'productURL': productURL.toString()
      },
    });
  }
  else {
    data = JSON.stringify({
      'phone': phone,
      'modeId': emailCode,
      'arguments': {
        'orderNumber': requestBody.orderID
      },
    });
  }

  console.log('JsonData:' + data);
  var options = {
    url: 'https://tectapi.geetest.com/v2/message',
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
    },
    form: data,
  }

  console.log('options: ', options);

  request((options), (err, response, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Response:'+response.body);
      console.log('body:', body);
    }
  });
  // END Geetest SMS
  logData(req);
  res.send(200, 'Publish');
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

  console.log("5 -- For Publish");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Published: "+req.body.inArguments[0]);        

  // Data from the req and put it in an array accessible to the main app.
  console.log(req.body);
  logData(req);
  res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

  console.log("5 -- For Validate");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Validated: "+req.body.inArguments[0]);       

  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  logData(req);
  res.send(200, 'Validate');
};
