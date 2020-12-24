var fs = require('fs');
var process = require('process');
var callstack = [];
var stackstack = [];
var files = [];
var exec = require('child_process').execSync;

var memory = undefined;
var inputBuffer = undefined;
var callback = undefined;

module.exports = {
  setMemory: function(m) {
    memory = m;
  },

  setInput: function(input, cb) {
    inputBuffer = input;
    if (cb) callback = cb;
  },

  getCurrentMinutes: function() {
    var d = (new Date());
    return 60 * (d.getHours()) + d.getMinutes();
  },
  
  getCurrentDay: function () {
    return (new Date()).getDate();
  },
  
  getCurrentMonth: function() {
    return (new Date()).getMonth() + 1;
  },
  
  getCurrentYear: function() {
    return (new Date()).getFullYear();    
  },

  printString: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];
    var length = new Uint8Array( memory, x, 1 )[0];
    var buffer = new Uint8Array( memory, x+1, length );
    var string = String.fromCharCode.apply(null, buffer);

    if (file.stdout) {
      process.stdout.write(string);
      return;
    }

    fs.writeSync( file.descriptor, string );    
  },
  
  printBoolean: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];    

    var result = x ? "TRUE" : "FALSE";

    if (file.stdout) {
      process.stdout.write(result);
      return;
    }

    fs.writeSync( file.descriptor, result );    
  },
  printChar: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];        
    if (file.stdout) {
      process.stdout.write(String.fromCharCode(x));
      return;
    }

    var b = Buffer.alloc(1);
    b[0] = x;
    fs.writeSync( file.descriptor, b );
  },
  printInteger: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];            
    if (file.stdout) {
      process.stdout.write(x.toString());
      return;
    }

    fs.writeSync( file.descriptor, x.toString());
  },
  printFloat: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];                
    if (file.stdout) {
      process.stdout.write(x.toString());
      return;
    }

    fs.writeSync( file.descriptor, x.toString());    
  },
  printNewline: function(descriptor, x) {
    var file = (descriptor < 0) ? {stdout:true} : files[descriptor];                    
    if (file.stdout) {
      process.stdout.write("\n");
      return;
    }

    fs.writeSync( file.descriptor, "\n");    
  },

  reset: function(length, pointer) {
    var buffer = new Uint8Array( memory, pointer, length );
    var filename = String.fromCharCode.apply(null, buffer);

    if (filename.startsWith('{')) {
      filename = filename.replace(/^{/g,'');
      filename = filename.replace(/}.*/g,''); 
    }
    
    filename = filename.replace(/ +$/g,'');
    filename = filename.replace(/^\*/,'');    
    filename = filename.replace(/^TeXfonts:/,'');    

    if (filename == 'TeXformats:TEX.POOL')
      filename = "tex.pool";

    if (filename == "TTY:") {
      files.push({ filename: "stdin",
                   stdin: true,
                   position: 0,
                   erstat: 0
                 });
      return files.length - 1;
    }

    try {
      var path = exec('kpsewhich ' + filename).toString().split("\n")[0];
    } catch (e) {
      files.push({
        filename: filename,
        erstat: 1
      });
      return files.length - 1;
    }
    
    files.push({
      filename: filename,
      position: 0,
      erstat: 0,      
      descriptor: fs.openSync(path,'r'),
    });
    
    return files.length - 1;
  },

  rewrite: function(length, pointer) {
    var buffer = new Uint8Array( memory, pointer, length );
    var filename = String.fromCharCode.apply(null, buffer);    

    filename = filename.replace(/ +$/g,'');    
    
    if (filename == "TTY:") {
      files.push({ filename: "stdout",
                   stdout: true,
                   erstat: 0,                   
                 });
      return files.length - 1;
    }

    files.push({
      filename: filename,
      position: 0,
      erstat: 0,      
      descriptor: fs.openSync(filename,'w')
    });
    
    return files.length - 1;
  },

  getfilesize: function(length, pointer) {
    var buffer = new Uint8Array( memory, pointer, length );
    var filename = String.fromCharCode.apply(null, buffer);
    
    if (filename.startsWith('{')) {
      filename = filename.replace(/^{/g,'');
      filename = filename.replace(/}.*/g,''); 
    }
    
    filename = filename.replace(/ +$/g,'');
    filename = filename.replace(/^\*/,'');    
    filename = filename.replace(/^TeXfonts:/,'');    

    if (filename == 'TeXformats:TEX.POOL')
      filename = "tex.pool";

    try {
      filename = exec('kpsewhich ' + filename).toString().split("\n")[0];
    } catch (e) {
      try {
        var stats = fs.statSync(filename);
        return stats.size;
      } catch (e) {
        return 0;
      }
    }
    
    return 0;
  },  

  close: function(descriptor) {
    var file = files[descriptor];

    if (file.descriptor)
      fs.closeSync( file.descriptor );

    files[descriptor] = {};
  },

  eof: function(descriptor) {
    var file = files[descriptor];
    
    if (file.eof)
      return 1;
    else
      return 0;
  },

  erstat: function(descriptor) {
    var file = files[descriptor];
    return file.erstat;
  },

  
  eoln: function(descriptor) {
    var file = files[descriptor];

    if (file.eoln)
      return 1;
    else
      return 0;
  },
    
  get: function(descriptor, pointer, length) {
    var file = files[descriptor];

    var buffer = new Uint8Array( memory );
    
    if (file.stdin) {
      if (file.position >= inputBuffer.length) {
	buffer[pointer] = 13;
        if (callback) callback();
      } else
	buffer[pointer] = inputBuffer[file.position].charCodeAt(0);
    } else {
      if (file.descriptor) {
        if (fs.readSync( file.descriptor, buffer, pointer, length, file.position ) == 0) {
          buffer[pointer] = 0;
          file.eof = true;
          file.eoln = true;
          return;
        }
      } else {
        file.eof = true;
        file.eoln = true;        
        return;
      }
    }
    
    file.eoln = false;
    if (buffer[pointer] == 10)
      file.eoln = true;
    if (buffer[pointer] == 13)
      file.eoln = true;

    file.position = file.position + length;
  },

  put: function(descriptor, pointer, length) {
    var file = files[descriptor];
    
    var buffer = new Uint8Array( memory );

    fs.writeSync( file.descriptor, buffer, pointer, length );
  },

};
