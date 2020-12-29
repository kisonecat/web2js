# web2js

This is a Pascal compiler that targets WebAssembly, designed
specifically to compile TeX.

Importantly, this version passes the [trip tests](http://texdoc.net/texmf-dist/doc/generic/knuth/tex/tripman.pdf) which you can verify by running `make test`.

## Prerequisites

This projects depends on [NodeJS](https://nodejs.org/en/) for executing the javascript.  To post-process the WebAssembly, you will need `wasm-opt` on your path.

You will need a full TeX installation (e.g., [TeX Live](https://www.tug.org/texlive/)) with access to `kpsewhich` in order that library.js can find the necessary TeX files.  You also need `tie` and `tangle` to turn the WEB sources into Pascal which can be fed to the compiler.

The contents of the `texk`, `triptrap`, and `etexdir` subdirectories were simply copied from tug.org via
```
mkdir texk
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/tex.web texk
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/triptrap .
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/etexdir .
```

## Getting started

After cloning this repository, be sure to run `npm install`.



The following assumes you have TeX running on your machine (e.g., that
`tangle` is available).


tie -c changes.ch tex.web etex.ch tex.ch

tie -c changes.ch tex.web etex.ch date.ch ord-chr.ch ximera.ch tex.ch 
tangle -underline tex.web changes.ch
node compile.js tex.p
wasm-opt --asyncify --pass-arg=asyncify-ignore-indirect -O out.wasm -o async.wasm
mv async.wasm out.wasm
node initex.js

need to use an INTEGER code for pdftexversion!!!!
@d eTeX_version_code=eTeX_int {code for \.{\\eTeXversion}}


Produce the Pascal source by tangling.
```
tangle -underline tex.web changes.ch
```
You will now have the Pascal source `tex.p` along with `tex.pool` which contains the strings.

Compile the `tex.p` sources to get the the WebAssembly binary `out.wasm`
```
npm install
npm run-script build
node compile.js tex.p
```
You may want to run
```
wasm-opt --asyncify --pass-arg=asyncify-ignore-indirect -O out.wasm -o async.wasm
mv async.wasm out.wasm
```
to get a version compatible with [https://github.com/GoogleChromeLabs/asyncify].

Produce `plain.fmt` and a corresponding memory dump.
```
node initex.js
```
Now compile `sample.tex` by running
```
node tex.js
```
