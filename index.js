const fs = require('fs');

// Lib imports
const split = require('./lib/split');
const classifier = require('./lib/classifier');

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  console.log('input ====================');
  console.log(data);

  console.log('characters ====================');
  console.log(data.split(''));
  console.log('');

  const result = split.run(data);
  console.log('ouput ====================');
  console.log(result);

  const classifications = classifier.classifyAll(result);
  console.log('classification ====================');
  console.log(classifications);
});

