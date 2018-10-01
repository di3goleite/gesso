const fs = require('fs');

// Lib imports
const lexicalAnalyzer = require('./lib/lexicalAnalyzer');
const classifier = require('./lib/classifier');

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  let result = lexicalAnalyzer.cleanUp(data);
  result = lexicalAnalyzer.split(result);
  result = lexicalAnalyzer.bandaid(result);
  result = classifier.run(result);

  const stream = fs.createWriteStream('teste/output.txt');
  const mapping = require('./common/classificationMap');

  let lineNumber = null;
  let classification = null;

  const lexemes = result.filter(function(item) {
    return item['type'] === 'lexeme';
  });

  const errors = result.filter(function(item) {
    return item['type'] === 'error';
  });

  // Write lexemes found
  lexemes.forEach(function(item) {
    lineNumber = parseInt(item['line']) < 10 ? '0' + item['line'] : item['line'];
    classification = mapping[item['class']];
    stream.write(`${lineNumber}\t${classification}\t${item['value']}\n`);
  });

  if (errors.length === 0) {
    stream.write(`\nArquivo analisado com sucesso. Nenhum erro foi encontrado.\n`);
  } else {
    stream.write(`\nArquivo analisado com falhas. Total de erros: ${errors.length}.\n`);

    // Write errors found
    errors.forEach(function(item) {
      lineNumber = parseInt(item['line']) < 10 ? '0' + item['line'] : item['line'];
      classification = mapping[item['class']];
      output = `${lineNumber}\t${classification}\t${item['value']}\n`;
      stream.write(output);
    });
  }

  stream.end();
});
