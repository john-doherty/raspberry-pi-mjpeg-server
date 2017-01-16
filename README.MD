# raspberry-pi-mjpeg-server
[![npm](https://img.shields.io/npm/dt/raspberry-pi-mjpeg-server.svg)](https://www.npmjs.com/package/raspberry-pi-mjpeg-server) [![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

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

[MIT License](LICENSE) &copy; 2016 [John Doherty](https://courseof.life/johndoherty)