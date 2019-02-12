var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('out.wasm');

var code = new WebAssembly.Module(binary);

var pages = 20;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

var buffer = new Uint8Array( memory.buffer );
var f = fs.openSync('core.dump','r');
if (fs.readSync( f, buffer, 0, pages*65536 ) != pages*65536)
  throw 'Could not load memory dump';

library.setMemory(memory.buffer);
library.setInput("\n\\input sample");

var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );
