var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('out.wasm');

var code = new WebAssembly.Module(binary);

var pages = process.env.PAGES ? Number(process.env.PAGES) : 20
console.log(pages)
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});
library.setMemory(memory.buffer);
if(!process.env.ETEX)
  library.setInput("\nplain \\dump\n\n",
                  function() {
                  });
else
  library.setInput("\n*latex.ltx \\dump\n\n",
    function () {
    });

var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );

library.setMemory(memory.buffer);
if (!process.env.ETEX)
  library.setInput("\n&plain\n\n",
    function() {
      var buffer = new Uint8Array( memory.buffer );                   
      fs.writeFileSync('core.dump', buffer);
      process.exit();
    });
else
  library.setInput("\n&latex\n\n",
    function () {
      var buffer = new Uint8Array(memory.buffer);
      fs.writeFileSync('core.dump', buffer);
      process.exit();
    });
                   
var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );

