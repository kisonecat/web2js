var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('out.wasm');

var code = new WebAssembly.Module(binary);

var pages = 20;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});
library.setMemory(memory.buffer);
library.setInput("\n\\input sample");

var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );
