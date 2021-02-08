var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('tex-async.wasm');

var code = new WebAssembly.Module(binary);

var pages = 2500;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

var buffer = new Uint8Array( memory.buffer );
var f = fs.openSync('core.dump','r');
if (fs.readSync( f, buffer, 0, pages*65536 ) != pages*65536)
  throw 'Could not load memory dump';

library.setMemory(memory.buffer);

let filename = process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  library.setInput(data,
                   function() {
                     process.exit();
                   });
  library.setInput(data);

  var wasm = new WebAssembly.Instance(code, { library: library,
                                              env: { memory: memory } } );

  wasm.exports.main();
});

