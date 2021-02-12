# web2js

This is a Pascal compiler that targets WebAssembly, designed
specifically to compile TeX so it can be run inside the browser.  More
specifically, this repository includes a TeX engine called jsTeX which
is like [LuaTeX](http://www.luatex.org/) but instead of embedding
[Lua](https://www.lua.org/) it embeds JavaScript.

Importantly, the jsTeX engine passes the [trip
tests](http://texdoc.net/texmf-dist/doc/generic/knuth/tex/tripman.pdf)
which you can verify by running `make test`.

There is a [live demo](https://tex.rossprogram.org/) and a short overview available at

> [J. Fowler, *Both TEX and DVI viewers inside the
web browser*, TUGboat, Volume 40 (2019), No. 1](https://www.tug.org/TUGboat/tb40-1/tb124fowler-js.pdf).

## Prerequisites

This projects depends on [NodeJS](https://nodejs.org/en/) for
executing the javascript.  To post-process the WebAssembly, you will
need `wasm-opt` on your path.

You will need a full TeX installation (e.g., [TeX
Live](https://www.tug.org/texlive/)) with access to `kpsewhich` in
order that `library.js` can find the necessary TeX files.  You also
need `tie` and `tangle` to turn the WEB sources into Pascal which can
be fed to the compiler.

The contents of the `texk`, `triptrap`, and `etexdir` subdirectories
were copied from tug.org via

```
mkdir texk
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/tex.web texk
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/triptrap .
rsync -a --delete --exclude=.svn tug.org::tldevsrc/Build/source/texk/web2c/etexdir .
```

## Getting started

After cloning this repository, run `npm install`.

Then run

```
make core.dump
```

to apply the changefiles, compile the resulting Pascal source to
WebAssembly, and run `initex.js` to produce a format file and its
corresponding memory dump.

Then you can run TeX on a file called `sample.tex` with

```
node tex.js sample.tex
```

## jsTeX

The main innovation of jsTeX is `\directjs` primitive similar to
LuaTeX's `\directlua`.  For example,

```latex
\documentclass[12pt]{article}

\newcommand{\cubeit}[1]{\directjs{
  tex.print('$');
  tex.print(`#1^3 = ${#1*#1*#1}`);
  tex.print('$');
}}

\begin{document}

Let's multiply eight by eight by eight.  \cubeit{8}

\end{document}
```

Inside `\directjs`, the JavaScript function `tex.print` can be used to
emit strings back into TeX for further processing.


