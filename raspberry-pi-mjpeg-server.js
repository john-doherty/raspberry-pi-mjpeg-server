#!/usr/bin/env node

var fs = require("fs"),
    os = require('os'),
    path = require('path'),
    http = require("http"),
    util = require("util"),
    PubSub = require("pubsub-js"),
    PiCamera = require('camerapi'),
    Getopt = require('node-getopt'),
    pjson = require('./package.json');

getopt = new Getopt([
    ['p', 'port', 'port number (default 8080)'],
    ['w', 'width', 'image width (default 640)'],
    ['l', 'height', 'image height (default 480)'],
    ['q', 'quality', 'jpeg image quality from 0 to 100 (default 85)'],
    ['t', 'timeout', 'timeout in milliseconds between frames (default 500)'],
    ['h', 'help', 'display this help'],
    ['v', 'version', 'show version']
]).bindHelp();

opt = getopt.parse(process.argv.slice(2));

getopt.setHelp(
    "Usage: " + pjson.name + " [OPTION]\n" +
    "\n" +
    "[[OPTIONS]]\n" +
    "\n"
);

if (opt.options["version"]) {
    console.log(pjson.name + " " + pjson.version);
    console.log(pjson.description);
    process.exit(0);
}

var port = opt.options["port"] || 8080,
    width = opt.options["width"] || 640,
    height = opt.options["height"] || 480,
    timeout = opt.options["timeout"] || 500,
    quality = opt.options["quality"] || 85,
    tmpFolder = os.tmpdir(),
    tmpImage = pjson.name + '-image.jpg',
    localIpAddress = require('node-local-ip-address')(),
    boundaryID = "BOUNDARY";

/**
 * create a server to serve out the motion jpeg images
 */
var server = http.createServer(function(req, res) {

    // return a html page if the user accesses the server directly
    if (req.url === "/") {
        res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
        res.write('<!doctype html>');
        res.write('<html>');
        res.write('<head><title>' + pjson.name + '</title><meta charset="utf-8" /></head>');
        res.write('<body>');
        res.write('<img src="image.jpg" />');
        res.write('</body>');
        res.write('</html>');
        res.end();
        return;
    }

    // for image requests, return a HTTP multipart document (stream) 
    if (req.url.match(/^\/.+\.jpg$/)) {

        res.writeHead(200, {
            'Content-Type': 'multipart/x-mixed-replace;boundary="' + boundaryID + '"',
            'Connection': 'keep-alive',
            'Expires': 'Fri, 27 May 1977 00:00:00 GMT',
            'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache'
        });

        //
        // send new frame to client
        //
        var subscriber_token = PubSub.subscribe('MJPEG', function(msg, data) {

console.log('sending image');

            res.write('--' + boundary + '\r\n')
            res.write('Content-Type: image/jpeg\r\n');
            res.write('Content-Length: ' + data.length + '\r\n');
            res.write("\r\n");
            res.write(Buffer(data), 'binary');
            res.write("\r\n");
        });

        //
        // connection is closed when the browser terminates the request
        //
        res.on('close', function() {
            console.log("Connection closed!");
            PubSub.unsubscribe(subscriber_token);
            res.end();
        });
    }
});

server.on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        console.log('port already in use');
    } else if (e.code == "EACCES") {
        console.log("Illegal port");
    } else {
        console.log("Unknown error");
    }
    process.exit(1);
});

// start the server
server.listen(port);
console.log(pjson.name + " started on port " + port);
console.log('Visit http://' + localIpAddress + ':' + port + ' to view your PI camera stream');
console.log('');

// try to access the camera stream
try {
    var camera = new PiCamera();
    camera.baseFolder(tmpFolder);
}
catch (err){
    console.log(err);
    process.exit(1);
}

/**
 * @description takes a single picture from pi camera and calls send image
 */
function captureImage() {

    camera.prepare({
        timeout : timeout, 
        width : width,
        height : height,
        quality : quality
    }).takePicture(tmpImage, sendImage);
}

/**
 * @description reads a jpg from disk and sends it to the client
 */
function sendImage(file, err) {

    if (!err) {

        fs.readFile(file, function(err, imageData) {
            if (!err) {
                PubSub.publish('MJPEG', imageData);
            }
            else {
                console.log(err);
            }

            // capture the next frame
            captureImage();
        });
    }
    else {
        console.log(err);
    }
}

captureImage();