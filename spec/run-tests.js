var glob = require('glob');
var child_process = require('child_process');
var fs = require('fs');
var colors = require('colors');
var logSymbols = require('log-symbols');

var fails = 0;
var successes = 0;

var crypto = require('crypto');

process.chdir(__dirname);

function runTest( filename ) {
  var outputFilename = filename.replace(/\.p$/, '.out');
  var desiredOutput;

  process.stdout.write("  ? ".red + filename.cyan + "\r");

  var source = fs.readFileSync( filename );
  var shasum = crypto.createHash('sha1');
  shasum.update(source);
  var hash = shasum.digest('hex');

  if (!fs.existsSync('.cache')){
    fs.mkdirSync('.cache');
  }
  
  try {
    desiredOutput = fs.readFileSync( `.cache/${hash}` );
  } catch (err) {
    child_process.execSync(`fpc -Mdelphi ${filename} 2> /dev/null`);
    desiredOutput = child_process.execSync("./" + filename.replace(/\.p$/, ''));
    fs.writeFileSync( `.cache/${hash}`, desiredOutput );
  }

  var output = child_process.execSync(`node ../index.js ${filename}`).toString();

  if (output == desiredOutput)  {
    process.stdout.write("  " + logSymbols.success.green + " " + filename.cyan + "\n");
    successes++;    
  } else {
    process.stdout.write("  " + logSymbols.error.red + " " + filename.cyan + "\n");
    fails++;    
  }

}

glob("*.p", {}, function (err, files) {
  if (err)
    throw err;
  else {
    console.log("> Running " + files.length + " tests\n");
    files.forEach( runTest );
    console.log(`\n> Finished.  ` + `${successes} succeeded`.green + `; ` + `${fails} failed`.red + `.\n`);
  }
});
