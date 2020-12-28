TEXWEB=texk/tex.web
ETEXCH=etexdir/etex.ch
CHANGE_FILES=$(ETEXCH) date.ch ord-chr.ch jstex.ch wordsize.ch 

all:

parser.js: parser.jison
	./node_modules/.bin/jison parser.jison

changes.ch: $(TEXWEB) $(CHANGE_FILES)
	tie -c $@ $(TEXWEB) $(CHANGE_FILES)

tripchanges.ch: $(TEXWEB) changes.ch trip.ch
	tie -c $@ $(TEXWEB) changes.ch trip.ch 

trip.web: $(TEXWEB)
	cp $< $@

trip.p trip.pool: trip.web tripchanges.ch
	tangle -underline trip.web tripchanges.ch
trip.pool: trip.p

trip.wasm: trip.p parser.js
	node compile.js $< $@

trip-async.wasm: trip.wasm
	wasm-opt --asyncify --pass-arg=asyncify-ignore-indirect -O $< -o $@

trip.tfm: triptrap/trip.pl
	pltotf $< $@

trip.tex: triptrap/trip.tex
	cp $< $@

tripin.log trip.fmt: trip.tfm trip.tex trip.js trip-async.wasm trip.pool
	echo -ne "\n\\input trip\n" | node trip.js 
	mv trip.log tripin.log
trip.fmt: tripin.log

trip.log trip.dvi tripos.tex 8terminal.tex: trip.tfm trip.tex trip.js trip-async.wasm trip.pool trip.fmt
	# how many spaces before & ?
	echo -ne "  &trip  trip " | node trip.js 
trip.dvi: trip.log
tripos.tex: trip.log
8terminal.tex: trip.log

trip.typ: trip.dvi
	dvitype -output-level=2 -dpi=72.27 -page-start=*.*.*.*.*.*.*.*.*.* $< > $@

test: tripdiff.js tripin.log trip.log triptrap/tripin.log triptrap/trip.log
	node tripdiff.js tripin.log triptrap/tripin.log
	node tripdiff.js trip.log triptrap/trip.log

clean:
	rm -f trip.tfm trip.tex
	rm -f trip.wasm
	rm -f trip-async.wasm
	rm -f trip.web
	rm -f tripchanges.ch
	rm -f trip.fmt
	rm -f tripin.log
	rm -f trip.p
	rm -f trip.pool
	rm -f trip.tex
	rm -f trip.tfm
	rm -f trip.typ
	rm -f trip.log trip.dvi tripos.tex 8terminal.tex
	rm -f trip.typ
