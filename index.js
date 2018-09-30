const fs = require('fs');

// Lib imports
const lexicalAnalyzer = require('./lib/lexicalAnalyzer');
const classifier = require('./lib/classifier');

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  console.log('input ====================');
  console.log(data);
  console.log('');

  let result = lexicalAnalyzer.cleanUp(data);
  result = lexicalAnalyzer.split(result);
  result = lexicalAnalyzer.bandaid(result);

  console.log('ouput ====================');
  console.log(result);
  console.log('');

  // const classifications = classifier.run(result);
  // console.log('classification ====================');
  // console.log(classifications);
});
