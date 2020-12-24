# web2js

This is a Pascal compiler that targets WebAssembly, designed
specifically to compile TeX.

## Getting started

The following assumes you have TeX running on your machine (e.g., that
`tangle` is available).

Download a clean copy of the TeX WEB sources.
```
wget http://ctan.math.washington.edu/tex-archive/systems/knuth/dist/tex/tex.web
```

https://tug.org/svn/texlive/trunk/Build/source/texk/web2c/etexdir/etex.ch?revision=32727&view=co


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
