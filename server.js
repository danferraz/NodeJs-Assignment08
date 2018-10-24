//
// # MinNodeServer
//
// by Rick Kozak

//require statements -- this adds external modules from node_modules or our own defined modules
const http = require('http');
const path = require('path');

//express related
const Express = require('express');
const bodyParser = require('body-parser');

//file access
const fs = require('fs-extra');

const OSINFO = require('os');
var username = OSINFO.userInfo();


//express is the routing engine most commonly used with nodejs
var express = Express();
var server = http.createServer(express);


//tell the express router where to find static files
express.use(Express.static(path.resolve(__dirname, 'client')));

//tell the router to parse urlencoded data and JSON data for us and put it into req.query/req.body
express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());

//set up the HTTP server and start it running
server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function () {
    var addr = server.address();
    console.log('Server listening at', addr.address + ':' + addr.port);
});


//tell the router how to handle a get request to the root
express.get('/', function (req, res) {
    console.log('client requests root');
    //use sendfile to send our index.html file  
    res.sendFile(path.join(__dirname, 'client/views', 'index.html'));

});

let salary = 0;
let day = 1;
const MAXDAYS = 32;
const CONVERTTODOLLAR = 100.0;

//tell the router how to handle a post request to /calc
express.post('/result', async function (req, res) {
    let msg = `client requests calc list with parameters: ${req.body.workingDayInput}`;
    let days = req.body.workingDayInput;
    if (days > 0 && days < MAXDAYS) {
        console.log('days: ', days);
        console.log('user info: ', username);

        // Constant values
        const ZERODAY = 0;
        const APENNY = 1;
        const ASCIIZERO = 48;
        const ASCIININE = 57;
        const MULTIPLYBYNUMBER = 2;

        let pennyPerDay = 1;

        await fs.ensureDir('data');
        for (; day <= days;) {
            salary += pennyPerDay;

            //write something to a file
            await fs.appendFile('data/output.txt', `Day - ${day++} $ ${day == ZERODAY ? APENNY : (pennyPerDay / CONVERTTODOLLAR)}\n`);
            pennyPerDay *= MULTIPLYBYNUMBER;
        }


        //write something to a file
        await fs.appendFile('data/output.txt', `\n\nTotal $ ${salary / CONVERTTODOLLAR} for ${day - 1} days.`);

    }
   

    //we can build and send HTML directly
    res.send(`<!DOCTYPE HTML>
    <HTML>
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <!-- To ensure proper rendering and touch zooming for all devices -->
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css">
        
        <link rel="icon" href="images/cent1.png" type="image/gif" sizes="12x12">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <title>Pennies For Pay</title>
    </head>
      <body> 
        <div class="card border-success mb-3 " style=" max-width: 25rem; height:14rem; padding:15px; margin-top:10%; margin-left:35%;">
            <div class="card-header p-2 mb-1 bg-transparent border-success" style="font-size: 20px;">
                Hello ${username.username.toUpperCase()}!
            </div>
            <div class="card-body">
                <p class="card-text">Your total salary is  $${salary / CONVERTTODOLLAR} for days ${day - 1}</p>                
            </div>
            <div class="card-footer bg-transparent border-success"><a href="/" class="btn btn-success">Go BACK</a></div>
        </div>     
      </body>
    </HTML>`);
});
