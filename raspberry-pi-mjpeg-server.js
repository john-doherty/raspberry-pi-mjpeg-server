#!/usr/bin/env node

var fs = require("fs"),
    os = require('os'),
    path = require('path'),
    http = require("http"),
    util = require("util"),
    chokidar = require('chokidar'),
    PubSub = require("pubsub-js"),
    localIp = require('ip'),
    PiCamera = require('./camera.js'),
    program = require('commander'),
    pjson = require('./package.json');

program
  .version(pjson.version)
  .description(pjson.description)
  .option('-p --port <n>', 'port number (default 8080)', parseInt)
  .option('-w --width <n>', 'image width (default 640)', parseInt)
  .option('-l --height <n>', 'image height (default 480)', parseInt)
  .option('-q --quality <n>', 'jpeg image quality from 0 to 100 (default 85)', parseInt)
  .option('-s --sharpness <n>', 'Set image sharpness (-100 - 100)', parseInt)
  .option('-c --contrast <n>', 'Set image contrast (-100 - 100)', parseInt)
  .option('-b --brightness <n>', 'Set image brightness (0 - 100) 0 is black, 100 is white', parseInt)
  .option('-s --saturation <n>', 'Set image saturation (-100 - 100)', parseInt)
  .option('-t --timeout <n>', 'timeout in milliseconds between frames (default 500)', parseInt)
  .option('-v --version', 'show version')
  .parse(process.argv);

program.on('--help', function(){
  console.log("Usage: " + pjson.name + " [OPTION]\n");
});

var port = program.port || 8080,
    width = program.width || 640,
    height = program.height || 480,
    timeout = program.timeout || 250,
    quality = program.quality || 75,
    sharpness = program.sharpness || 0,
    contrast = program.contrast || 0,
    brightness = program.brightness || 50,
    saturation = program.saturation || 0,
    tmpFolder = os.tmpdir(),
    tmpImage = pjson.name + '-image.jpg',
    localIpAddress = localIp.address(),
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

    if (req.url === "/healthcheck") {
        res.statusCode = 200;
        res.end();
        return;
    };

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

            //console.log('sending image');

            res.write('--' + boundaryID + '\r\n')
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


var tmpFile = path.resolve(path.join(tmpFolder, tmpImage));

// start watching the temp image for changes
var watcher = chokidar.watch(tmpFile, {
  persistent: true,
  usePolling: true,
  interval: 10,
});

// hook file change events and send the modified image to the browser
watcher.on('change', function(file) {

    //console.log('change >>> ', file);

    fs.readFile(file, function(err, imageData) {
        if (!err) {
            PubSub.publish('MJPEG', imageData);
        }
        else {
            console.log(err);
        }
    });
});

// setup the camera 
var camera = new PiCamera();

// start image capture
camera
    .nopreview()
    .baseFolder(tmpFolder)
    .thumb('0:0:0') // dont include thumbnail version
    .timeout(9999999) // never end
    .timelapse(timeout) // how often we should capture an image
    .width(width)
    .height(height)
    .quality(quality)
    .sharpness(sharpness)
    .contrast(contrast)
    .brightness(brightness)
    .saturation(saturation)
    .takePicture(tmpImage);
