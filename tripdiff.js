var fs = require('fs');
var Diff = require('diff');
const colors = require('colors');

var testeeFilename = process.argv[2];
var originalFilename = process.argv[3];

var testee = fs.readFileSync(testeeFilename).toString();
var original = fs.readFileSync(originalFilename).toString();

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

  if (b == 'This is TeX, Version 3.14159265 (INITEX)  7 JAN 2014 09:09\n') {
    return ('Banner is permitted to differ.');
  }  

  if (b == ' (preloaded format=trip 2014.1.7)\n') {
    return ('Date of format file is permitted to differ.');
  }

  if (b == ' (preloaded format=trip 2014.1.7)\n1326 strings of total length 23646\n') {
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

  if (b == 'Output written on trip.dvi (16 pages, 2920 bytes).\n') {
    return ('Size of dvi output can differ.');
  }  

  return false;
}

for(const diff of diffs) {
  [x, y] = diff;

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
