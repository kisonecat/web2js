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
Produce the Pascal source by tangling.
```
tangle -underline tex.web
```
You will now have the Pascal source `tex.p` along with `tex.pool` which contains the strings.

Compile the `tex.p` sources to get the the WebAssembly binary `out.wasm`
```
npm install
npm run-script build
node compile.js tex.p
```
Produce `plain.fmt` and a corresponding memory dump.
```
node initex.js
```
Now compile `sample.tex` by running
```
node tex.js
```
