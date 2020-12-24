tie -c changes.ch tex.web etex.ch date.ch ord-chr.ch ximera.ch tex.ch
tangle -underline tex.web changes.ch
node compile.js tex.p
wasm-opt --asyncify --pass-arg=asyncify-ignore-indirect -O out.wasm -o async.wasm
mv async.wasm out.wasm
node initex.js
