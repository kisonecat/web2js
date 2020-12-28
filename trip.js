
var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('trip-async.wasm');

var code = new WebAssembly.Module(binary);

var pages = 2500;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});
library.setMemory(memory.buffer);
library.setTexPool('trip.pool');

var stdinBuffer = fs.readFileSync(0).toString(); // STDIN_FILENO = 0
library.setInput(stdinBuffer,
                 function() {
                 });

var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );
wasm.exports.main();
