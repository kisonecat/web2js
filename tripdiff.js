var fs = require('fs');
var Diff = require('diff');
const colors = require('colors');

var testeeFilename = process.argv[2];
var originalFilename = process.argv[3];

var testee = fs.readFileSync(testeeFilename).toString();
var original = fs.readFileSync(originalFilename).toString();

// I am not using ./ in filenames
original = original.replace('(./etrip.tex', '(etrip.tex');
original = original.replace(/\(\.\/etrip\.out/g, '(etrip.out');

var diffs = Diff.diffLines(testee, original);
diffs = diffs.filter( (diff) => (diff.removed || diff.added) );
diffs = diffs.reduce(function(result, value, index, array) {
  if (index % 2 === 0)
    result.push(array.slice(index, index + 2));
  return result;
}, []);

function isNotTooDifferent(a, b) {
  if (b == 'This is TeX, Version 3.14159265 (preloaded format=trip 2014.1.7)  7 JAN 2014 09:59\n') {
    return ('Banner is permitted to differ.');
  }

  if (b == 'This is e-TeX, Version 3.14159265-2.6 (TeX Live 2014) (INITEX)  22 JAN 2014 11:25\n') {
    return ('Banner is permitted to differ.');
  }

  if (b == 'This is e-TeX, Version 3.14159265-2.6 (TeX Live 2014) (preloaded format=etex)\n') {
    return ('Banner is permitted to differ.');
  }
  
  if (b == 'This is DVItype, Version 3.6 (TeX Live 2014)\n') {
    return ('Banner is permitted to differ.');
  }


  if (b == '\' TeX output 2014.01.22:1125\'\n') {
    return ('Dates and times can differ.');
  }
  
  if (a == '(etrip.tex\n') {
    return ('Filename is permitted to differ.');
  }  
  
  if (b == 'This is TeX, Version 3.14159265 (INITEX)  7 JAN 2014 09:09\n') {
    return ('Banner is permitted to differ.');
  }

  if (b == 'This is e-TeX, Version 3.14159265-2.6 (TeX Live 2014) (preloaded format=etrip 2014.1.22)  22 JAN 2014 11:25\n') {
    return ('Banner is permitted to differ.');
  }    

  if (b == ' (preloaded format=trip 2014.1.7)\n') {
    return ('Date of format file is permitted to differ.');
  }

  if (b == ' (preloaded format=trip 2014.1.7)\n1326 strings of total length 23646\n') {
    return ('Date of format file is permitted to differ.');
  }

  if (b == ' (preloaded format=etrip 2014.1.22)\n1491 strings of total length 26258\n') {
    return ('Date of format file is permitted to differ.');
  }  

  if (b == ' 47 strings out of 1674\n') {
    return ('Number of strings is permitted to differ.');
  }  

  if (b == ' 372 multiletter control sequences out of 2100\n') {
    return ('Number of control sequences is permitted to differ.');
  }  

  if (b == '341 multiletter control sequences\n') {
    return ('Number of control sequences is permitted to differ.');
  }

  if (b == '408 multiletter control sequences\n') {
    return ('Number of control sequences is permitted to differ.');
  }    

  if ((b == 'Hyphenation trie of length 434 has 12 ops out of 35111\n') &&
      (a.startsWith('Hyphenation trie of length 434 has 12 ops out of '))) {
    return ('Number of control sequences is permitted to differ.');
  }    
  
  if (b.match(/, glue set /)) {
    var lefts = a.split(', glue set ');
    var rights = b.split(', glue set ');

    if (lefts[0] == rights[0]) {
      var l = parseFloat(lefts[1].replace( 'fil', '' ));
      var r = parseFloat(rights[1].replace( 'fil', '' ));
      if (Math.abs(l-r) < 0.00005) {
        return ('Some glue differs by ' + Math.abs(l-r).toString());
      }
    }
  }

  if (a.startsWith('Memory usage before: ') && b.startsWith('Memory usage before: ')) {
    return 'Memory usage may differ.';
  }  

  if (b == ' 19 strings out of 1809\n 145 string characters out of 7742\n 3164 words of memory out of 3999\n 409 multiletter control sequences out of 15000+0\n') {
    return 'Memory usage may differ.';
  }

  if (b == ' 10 hyphenation exceptions out of 659\n') {
    return 'Hyphenation can differ?';
  }  
  
  if (b == 'Output written on trip.dvi (16 pages, 2920 bytes).\n') {
    return ('Size of dvi output can differ.');
  }  

  return false;
}

for(const diff of diffs) {
  [x, y] = diff;

  if ((x === undefined) || (y === undefined)) {
    if (y) process.stdout.write(y.value.red);
    if (x) process.stdout.write(x.value.green);  
    console.log('Test failed.'.red.bold);
    process.exit(1);
  }

  if (x.added && y.removed)
    [x,y] = [y,x];

  process.stdout.write(y.value.red);
  process.stdout.write(x.value.green);  
  
  var result = isNotTooDifferent(diff[0].value, diff[1].value);

  if (result == false) {
    console.log('Test failed.'.red.bold);
    process.exit(1);
  } else {
    console.log(result.yellow);
    process.stdout.write('\n');
  }
}

console.log('Tests passed!'.green.bold);
process.exit(0);
