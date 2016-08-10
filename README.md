# raspberry-pi-mjpeg-server

Node.js mjpeg streaming server to provide video like access to the Raspberry PI camera module

## Installation

```js
npm install raspberry-pi-mjpeg-server --save
```

## Usage

```
$ sudo ./raspberry-pi-mjpeg-server -w 1280 -h 1024
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

  http://rpi-ip-address:port

You can get direct access to the image (HTTP multipart document) via 

  http://rpi-ip-address:port/image.jgg

## License

[MIT License](LICENSE) &copy; 2016 [John Doherty](https://courseof.life/johndoherty)