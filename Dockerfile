FROM adnrv/texlive:full 

# Update packages
RUN tlmgr update --self
RUN tlmgr update --all

# Install node
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq \
    && apt-get install unzip -yq

WORKDIR /usr/var

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run-script build

# Download a clean copy of the TeX WEB sources.
RUN wget http://mirrors.ctan.org/systems/knuth/dist/tex/tex.web

# Number of pages needed in wasm, use 20 for tex, 3732 for etex (increase if error like 'Need 3732 of memory')
ENV PAGES=20

# Produce the Pascal source by tangling.
# For tex
RUN tangle -underline tex.web
# You will now have the Pascal source `tex.p` along with `tex.pool` which contains the strings.

# Compile the `tex.p` sources to get the the WebAssembly binary `out.wasm`
RUN node compile.js tex.p

# Produce `plain.fmt` and a corresponding memory dump.
RUN node initex.js
# Now compile `sampleLatex.tex` by running
RUN node tex.js sample

# Copy tex files to tex folder
RUN mkdir tex && mv out.wasm tex && mv plain.fmt tex && mv core.dump tex

# Download a clean copy of etex.ch
RUN wget "http://tug.org/svn/texlive/trunk/Build/source/texk/web2c/etexdir/etex.ch?revision=32727&view=co" --output-document=etex.ch

# Number of pages needed in wasm, use 20 for tex, 3732 for etex (increase if error like 'Need 3732 of memory')
ENV PAGES=3732
# Comment this line for tex, uncomment for etex
ENV ETEX=true
COPY etex.sys etex.sys

# Produce the Pascal source by tangling.
# For etex
RUN tie -m etex.web tex.web etex.ch
RUN tangle -underline etex.web etex.sys
# You will now have the Pascal source `etex.p` along with `etex.pool` which contains the strings.

# For tex
RUN tangle -underline tex.web
# You will now have the Pascal source `tex.p` along with `tex.pool` which contains the strings.

# Compile the `etex.p` sources to get the the WebAssembly binary `out.wasm`
RUN node compile.js etex.p

# Produce `plain.fmt` and a corresponding memory dump.
RUN node initex.js
# Now compile `sampleLatex.tex` by running
RUN node tex.js sampleLatex

# Copy etex files to etex folder
RUN mkdir etex && mv out.wasm etex && mv latex.fmt etex && mv core.dump etex

