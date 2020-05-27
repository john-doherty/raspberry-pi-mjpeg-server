# raspberry-pi-mjpeg-server
[![npm](https://img.shields.io/npm/dt/raspberry-pi-mjpeg-server.svg)](https://www.npmjs.com/package/raspberry-pi-mjpeg-server) [![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty)

Node.js mjpeg streaming server to provide video like access to the Raspberry PI camera module

## Installation

```js
npm install raspberry-pi-mjpeg-server --save
```

## Usage

```
$ node raspberry-pi-mjpeg-server.js -w 1280 -l 1024
```

### Options

```
  -p, --port        port number (default 8080)
  -w, --width       image width (default 640)
  -l, --height      image height (default 480)
  -q, --quality     jpeg image quality from 0 to 100 (default 85)
  -s, --sharpness  Set image sharpness (-100 - 100)
  -c, --contrast   Set image contrast (-100 - 100)
  -b, --brightness Set image brightness (0 - 100) 0 is black, 100 is white
  -s, --saturation Set image saturation (-100 - 100)
  -t, --timeout     timeout in milliseconds between frames (default 500)
  -h, --help        display this help
  -v, --version     show version
```

## Access the stream

Open your browser and visit:

```
http://rpi-ip-address:port
```

You can get direct access to the image (HTTP multipart document) via 

```
http://rpi-ip-address:port/image.jpg
```

## License

[MIT License](LICENSE) &copy; 2016 [John Doherty](https://twitter.com/mrJohnDoherty)