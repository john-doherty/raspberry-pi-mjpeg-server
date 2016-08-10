var util = require('util');

module.exports = function Camera(){
    
    this.ENCODING_JPEG = "jpg";
    this.ENCODING_BMP = "bmp";
    this.ENCODING_GIF = "gif";
    this.ENCODING_PNG = "png";
    
    this.filename = null;
    this.folder = null;
    this.command = "raspistill";
    this.parameters= [];
    
    this.takePicture = function takePicture(file,callback){
        
        if (typeof(file) == "function") {
            callback = file;
            file=null;
        }
        
        if(!this.folder){
            this.folder = util.format("%s/pitures", __dirname);
        }
        
        if(file){
            this.filename = util.format("%s/%s", this.folder, file);
        }else{
            this.filename = util.format("%s/%s.jpg", this.folder, new Date().toJSON());
        }
        
        this.output(this.filename);
        
        this.command = "raspistill";
        
        for (key in this.parameters) {
            
            //JD: remove this as .nopreview required a value in order to be set but the command did not require a value
            //if (this.parameters[key]){
                this.command+= util.format(' %s %s ', key, this.parameters[key]);
            //}
            
        }
        
        var exec = require('child_process').exec,child;
        
        var self = this;

        console.log('executing...');
        console.log(this.command);
        console.log('---');
        
        child = exec(this.command,function (error, stdout, stderr) {
            
            if(callback!==undefined){
                callback(self.filename,stderr);
            }
            
        });
    },
    this.recordVideo = function(file, callback){
        
        if (typeof(file) == "function") {
            callback = file;
            file=null;
        }
        
        if(!this.folder){
            this.folder = util.format("%s/videos", __dirname);
        }
        
        if(file){
            this.filename = util.format("%s/%s", this.folder, file);
        }else{
            this.filename = util.format("%s/%s.h264", this.folder, new Date().toJSON());
        }
        
        this.output(this.filename);
        
        this.command = "raspivid";
        
        
        //if we are streaming remove output command
        if(this.parameters['-o - >']){
            delete this.parameters["-o"];
        }
        
        for(key in this.parameters){
            
            if(this.parameters[key]){
                this.command+= util.format(' %s %s ', key, this.parameters[key]);
            }
            
        }
        
        var exec = require('child_process').exec,child;
        
        var self = this;
        
        child = exec(this.command,function (error, stdout, stderr) {
            
            if(callback!==undefined){
                callback(self.filename,stderr);
            }
            
        });
        
    },
    this.prepare = function(parameters){
        
        for(key in parameters){
            this[key](parameters[key]);
        }
        
        return this;
        
    },
    this.quality = function(value){
        
        this.parameters['-q']= value;
        
        return this;
    },
    this.width = function(value){
        
        this.parameters['-w']= value;
        
        return this;
    },
    this.height = function(value){
        
        this.parameters['-h']= value;
        
        return this;
    },
    this.preview = function(value){
        
        this.parameters["-p"] = value;
        
    },
    this.fullscreen = function(value){ 
        
        if(value===undefined)
            value="";
        
        this.parameters["-f"] = value;
        
        return this;
        
    },
    this.nopreview  = function(value) {
        
        if(value===undefined)
            value="";
        
        this.parameters["-n"] = value;
        
        return this;
        
    },    
    this.opacity  = function(value){
        
        this.parameters["-op"] = value;
        
        return this;
        
    },
    this.sharpness= function(value){
        
        this.parameters["-sh"] = value;
        
        return this;
        
    },
    this.contrast= function(value){
        
        this.parameters["-co"] = value;
        
        return this;
        
    },
    this.brightness= function(value){
        
        this.parameters["-br"] = value;
        
        return this;
        
    },
    this.saturation= function(value){
        
        this.parameters["-sa"] = value;
        
        return this;
        
    },
    this.ISO= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-ISO"] = value;
        
        return this;
        
    },
    this.vstab= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-vs"] = value;
        
        return this;
        
    },
    this.ev= function(value){
        
        this.parameters["-ev"] = value;
        
        return this;
        
    },
    this.exposure= function(value){
        
        this.parameters["-ex"] = value;
        
        return this;
        
    },
    this.awb= function(value){
        
        this.parameters["-awb"] = value;
        
        return this;
        
    },
    this.imxfx= function(value){
        
        this.parameters["-ifx"] = value;
        
        return this;
        
    },
    this.colfx= function(value){
        
        this.parameters["-cfx"] = value;
        
        return this;
        
    },
    this.metering= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-mm"] = value;
        
        return this;
        
    },
    this.rotation= function(value){
        
        this.parameters["-rot"] = value;
        
        return this;
        
    },
    this.hflip= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-hf"] = value;
        
        return this;
        
    },
    this.vflip= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-vf"] = value;
        
        return this;
        
    },
    this.roi= function(value){
        
        this.parameters["-roi"] = value;
        
        return this;
        
    },
    this.shutter= function(value){
        
        this.parameters["-s"] = value;
        
        return this;
        
    },
    this.drc= function(value){
        
        this.parameters["-drc"] = value;
        
        return this;
        
    },
    this.raw= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-r"] = value;
        
        return this;
        
    },
    this.output= function(value){
        
        this.filename = value;
        this.parameters["-o"] = value;
        
        return this;
        
    },
    this.latest= function(value){
        
        this.parameters["-l"] = value;
        
        return this;
        
    },
    this.verbose= function(value){
        
        this.parameters["-v"] = value;
        
        return this;
        
    },
    this.timeout= function(value){
        
        this.parameters["-t"] = value;
        
        return this;
        
    },
    this.timelapse= function(value){
        
        this.parameters["-tl"] = value;
        
        return this;
        
    },
    this.thumb= function(value){
        
        this.parameters["-th"] = value;
        
        return this;
        
    },
    this.demo= function(value){
        
        this.parameters["-d"] = value;
        
        return this;
        
    },
    this.encoding= function(value){
        
        this.parameters["-e"] = value;
        
        return this;
        
    },
    this.exif= function(value){
        
        this.parameters["-x"] = value;
        
        return this;
        
    },
    this.fullpreview= function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-fp"] = value;
        
        return this;
        
    },
    this.signal= function(value){
        
        this.parameters["-s"] = value;
        
        return this;
        
    },
    this.bitrate = function(value){
        
        this.parameters["-b"] = value;
        
        return this;
        
    },
    this.framerate = function(value){
        
        this.parameters["-fps"] = value;
        
        return this;
        
    },
    this.penc = function(value){
        
        if(value===undefined)
            value="";
        
        this.parameters["-e"] = value;
        
        return this;
        
    },
    this.intra = function(value){
        
        this.parameters["-g"] = value;
        
        return this;
        
    },
    this.qp = function(value){
        
        this.parameters["-qp"] = value;
        
        return this;
        
    },
    this.profile  = function(value){
        
        this.parameters["-pf"] = value;
        
        return this;
        
    },
    this.inline  = function(value){
        
        this.parameters["-ih"] = value;
        
        return this;
        
    },
    this.timed  = function(value){
        
        this.parameters["-td"] = value;
        
        return this;
        
    },
    this.initial  = function(value){
        
        this.parameters["-i"] = value;
        
        return this;
        
    },
    this.segment  = function(value){
        
        this.parameters["-sg"] = value;
        
        return this;
        
    },
    this.wrap  = function(value){
        
        this.parameters["-wr"] = value;
        
        return this;
        
    },
    this.start  = function(value){
        
        this.parameters["-sn"] = value;
        
        return this;
        
    },
    this.streamVideo = function(value){
        
        this.parameters["-o - >"] = value;
        
        return this;
        
    }
    this.baseFolder = function(directory){
        this.folder = directory;

        // JD added return this to allow chaining
        return this;
    },
    this.reset = function(){
        this.parameters= [];
    }
};

