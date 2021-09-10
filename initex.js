var fs = require('fs');
var library = require('./library');

var binary = fs.readFileSync('tex-async.wasm');

var code = new WebAssembly.Module(binary);

var pages = 2500;
var memory = new WebAssembly.Memory({initial: pages, maximum: pages});

library.setInput("*latex.ltx\n\\dump\n\n",
                 function() {
                 });
library.setMemory(memory.buffer);

var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );

const wasmExports = wasm.exports;
library.setWasmExports( wasmExports );

wasm.exports.main();

let preamble = "\\documentclass{article}\n\\usepackage{nopageno}\n\\def\\pgfsysdriver{pgfsys-ximera.def}\\usepackage{tikz}\n\\usepackage[paperheight=100in,paperwidth=8.5in]{geometry}\n";

preamble = "\\documentclass{article}\n\\usepackage{nopageno}\n\\def\\pgfsysdriver{pgfsys-ximera.def}\\usepackage{tikz}\n";
//preamble = "";

//preamble = "\\documentclass[margin=0pt]{standalone}\n\\def\\pgfsysdriver{pgfsys-ximera.def}\\usepackage{tikz}\n";

//preamble = "\\RequirePackage[makeroom]{cancel}\n\\RequirePackage{url}\n\\RequirePackage[table]{xcolor}\n\\RequirePackage{tikz}\n\\RequirePackage{pgfplots}\n\\usepgfplotslibrary{groupplots}\n\\usetikzlibrary{calc}\n\\RequirePackage{fancyvrb}\n\\RequirePackage{forloop}\n\\RequirePackage{amssymb}\n\\RequirePackage{amsmath}\n\\RequirePackage{amsthm}\n\\RequirePackage{xifthen}\n\\RequirePackage{multido}\n\\RequirePackage{listings}\n\\RequirePackage{comment}\n\\RequirePackage{gettitlestring}\n\\RequirePackage{nameref}\n\\RequirePackage{epstopdf}";

//preamble = "\\RequirePackage[makeroom]{cancel}\n\\RequirePackage{url}\n\\RequirePackage[table]{xcolor}\n\\RequirePackage{tikz}\n\\RequirePackage{pgfplots}\n\\usepgfplotslibrary{groupplots}\n\\usetikzlibrary{calc}\n\\RequirePackage{fancyvrb}\n\\RequirePackage{forloop}\n\\RequirePackage{amssymb}\n\\RequirePackage{amsmath}\n\\RequirePackage{amsthm}\n\\RequirePackage{xifthen}\n\\RequirePackage{multido}\n\\RequirePackage{listings}\n\\RequirePackage{comment}\n\\RequirePackage{gettitlestring}\n\\RequirePackage{nameref}\n\\RequirePackage{epstopdf}";

//preamble = "\\def\\pgfsysdriver{pgfsys-ximera.def}\\RequirePackage[makeroom]{cancel}\n\\RequirePackage{url}\n\\RequirePackage[table]{xcolor}\n\\RequirePackage{tikz}\n\\RequirePackage{pgfplots}\n\\usepgfplotslibrary{groupplots}\n\\usetikzlibrary{calc}\n\\RequirePackage{fancyvrb}\n\\RequirePackage{forloop}\n\\RequirePackage{amssymb}\n\\RequirePackage{amsmath}\n\\RequirePackage{amsthm}\n\\RequirePackage{xifthen}\n\\RequirePackage{multido}\n\\RequirePackage{comment}\n\\RequirePackage{gettitlestring}\n\\RequirePackage{nameref}\n\\RequirePackage{pgffor}\n\\RequirePackage{array}\n\\RequirePackage{tkz-euclide}\n\\RequirePackage{tikz-cd}\n";

libraries = [
  "calc",
  "positioning",
  "fit",
  "backgrounds",
  "trees",
  "arrows",
  "shapes",
  "shapes.geometric",
  "shapes.misc",
  "shapes.symbols",
  "shapes.arrows",
  "shapes.callouts",
  "shapes.multipart",
  "decorations.text",
  "3d",
  "angles",
  "babel",
  "decorations.markings",
  "decorations.shapes",
  "intersections",
  "patterns",
  "quotes",
  "shadows",
  "fadings",
  "through",
  "pgfplots.groupplots"
]

let tikzlibraries = libraries.map( (library) => `\\usetikzlibrary{${library}}` ).join('')

packages = [
  "listings",
"lstmisc",
"everyhook",
"svn-prov",
"etoolbox",
"xcolor",
"url",
"fancyvrb",
"keyval",
"tkz-euclide",
"tikz",
"tikz-cd",
"pgf",
"pgfrcs",
"pgffor",
"pgfkeys",
"pgfplots",
"forloop",
"ifthen",
"environ",
"trimspaces",
"amssymb",
"amsfonts",
"amsmath",
"amstext",
"amsgen",
"amsbsy",
"amsopn",
"amsthm",
"xifthen",
"calc",
  "ifmtarg",
  "multido",
  "comment",
  "gettitlestring",
"kvoptions",
"ltxcmds",
"kvsetkeys",
"nameref",
"refcount",
"infwarerr",
"fontenc",
"hyperref",
"iftex",
"pdftexcmds",
"kvdefinekeys",
"pdfescape",
"hycolor",
"letltxmacro",
"auxhook",
"intcalc",
"etexcmds",
"bitset",
"bigintcalc",
"atbegshi-ltx",
"rerunfilecheck",
"ifvtex"
]

preamble = "\\def\\pgfsysdriver{pgfsys-ximera.def}\\PassOptionsToPackage{dvisvgm}{graphicx}\\PassOptionsToPackage{hypertex}{hyperref}\\RequirePackage{expl3}\\RequirePackage[makeroom]{cancel}" + packages.map( (package) => `\\RequirePackage{${package}}` ).join('') + tikzlibraries + "\\PassOptionsToClass{web}{ximera}\\let\\abovecaptionskip=\\relax\\let\\belowcaptionskip=\\relax\\let\\maketitle=\\relax\n";

preamble = preamble + "\\documentclass{ximera}\\renewcommand{\\documentclass}[2][]{}\\snapshot\n";

library.setMemory(memory.buffer);
library.setInput("\n&latex\n" + preamble + "\n\n\n",
                 function() {
                   var buffer = new Uint8Array( memory.buffer );
                   fs.writeFileSync('core.dump', buffer);
                   process.exit();
                 });
                   
var wasm = new WebAssembly.Instance(code, { library: library,
                                            env: { memory: memory } } );

console.log( wasm.exports );
wasm.exports.main();

