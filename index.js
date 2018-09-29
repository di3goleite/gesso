const fs = require('fs');

// Lib imports
const split = require('./lib/split');
const classifier = require('./lib/classifier');

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  console.log('input ====================');
  console.log(data);

  // console.log('characters ====================');
  // console.log(data.split(''));
  // console.log('');

  console.log('ouput ====================');
  const result = split.run(data);
  console.log(result);
  console.log(result.length);
  console.log('');

  // console.log('classification ====================');
  // const classifications = classifier.run(result);
  // console.log(classifications);
});
