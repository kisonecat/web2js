var fs = require('fs');

function trace(s) {
  if (s.match(/print/)) return;
  //console.log("trace:",s);
}

function trace_exit(s) {
  if (s.match(/print/)) return;
  //console.log("return from",s);
}

//var inputBuffer = "\\catcode`\\{=1 % left brace is begin-group character"
//var inputBuffer = " \n";
//var inputBuffer = fs.readFileSync("plain.tex");
//var inputBuffer = "plain.tex\n" + fs.readFileSync("plain.tex");
//var inputBuffer = "\\message{Preloading the plain format: codes,}";
//var inputBuffer = "plain\n\\bye\n";
var inputBuffer = "plain\n\\input sample";

var round = Math.round;
var abs = Math.abs;

function odd(x) {
  return (x%2 == 1);
}

function chr(x) {
  return x;
}

function erstat(handle) {
  return 0;
}

function _break(handle) {
  handle._break();
}

function breakin(handle, toggle) {
  handle.breakin(toggle);
}


function close(handle) {
  handle.close();
}

function get(handle) {
  handle.get();
}

function eof(handle) {
  return handle.eof();
}

function eoln(handle) {
  return handle.eoln();
}

function readln(handle) {
  return handle.readln();
}

function write(f) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();  
  return f.write.apply(f,args);
}

function writeln(f) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  return f.writeln.apply(f,args);
}

function rewrite(f,filename,ignore) {
  f.rewrite(filename,ignore);
}

function reset(f,filename,ignore) {
  f.reset(filename,ignore);
}

class FileHandle {
  constructor(label) {
    this.label = label;
  }

  writeln(str) {
    if (this.stdout) {
      if (str===undefined)
        process.stdout.write("\n");
      else
        console.log(str);
      return;
    }
  }

  _break() {
    if (this.stdout) {    
      //process.stdout.write("\n");
      return;
    }
  }

  breakin(toggle) {
    if (this.stdout) {    
      //process.stdout.write("\n");
      return;
    }
  }

  
  write(str) {
    if (str === undefined) {
      console.trace("writing undefined to ", this.filename);
    }
    
    if (this.stdout) {
      if (typeof str == "number") {
	str = String.fromCharCode(str);
      }
      
      if (str === undefined) {
        return;
      }
      
      process.stdout.write(str);
      return;
    }

    if (typeof str == "number")
      str = new Buffer([str]);
      
    fs.writeSync( this.descriptor, str );
  }

  eof() {
    if (this.stdin) {
      return false;
    }

    var b = Buffer.alloc(1);    
    
    if (fs.readSync( this.descriptor, b, 0, 1, this.position ) == 0)
      return true;
    else
      return false;
  }

  eoln() {
    var result = this.arrow;
    return (result == 10) || (result == 13) || (result == "\n");
  }
  
  reset(filename,ignore) {
    if (filename == "TTY:") {
      console.log("open TTY reading");
      this.filename = "stdin";      
      this.stdin = true;
      this.position = -1;
      return;
    } else {
      if (typeof filename !== "string")
	filename = String.fromCharCode.apply(null, filename);

      filename = filename.replace(/ +$/g,'');
      filename = filename.replace(/^TeXfonts:/,'fonts/');    

      if (filename == 'TeXformats:TEX.POOL')
	filename = "tex.pool";

      this.filename = filename;
      this.position = -1;
      this.descriptor = fs.openSync(filename,'r');
    }

    this.get();
  }

  read() {
    var b = this.arrow;
    this.get();
    return b;
  }
  
  get() {
    var b = Buffer.alloc(1);
    
    this.position = this.position + 1;

    if (this.stdin) {
      if (this.position >= inputBuffer.length)
	b[0] = 13;
      else
	b[0] = inputBuffer[this.position].charCodeAt(0);
    } else {
      fs.readSync( this.descriptor, b, 0, 1, this.position );
    }

    this.arrow = b[0];
  }
  
  readln() {
    while( ! this.eoln() ) 
      this.get();
    
    this.get();
    return;
  }

  rewrite(filename,ignore) {
    if (typeof filename !== "string")
      filename = String.fromCharCode.apply(null, filename);

    filename = filename.replace(/ +$/g,'');    
    
    if (filename == "TTY:") {
      this.filename = "stdout";
      this.stdout = true;
      return;
    }

    this.filename = filename;
    this.descriptor = fs.openSync(filename,'w');    
  }

  close() {
  }
}
