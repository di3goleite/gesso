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
  const mapping = require('./common/classificationMapping');

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
    classification = mapping['lexical'][item['class']];
    stream.write(`${lineNumber}\t${classification}\t${item['value']}\n`);
  });

  // Show errors if they exists
  if (errors.length > 0) {
    if (lexemes.length > 0) {
      stream.write(`\n`);
    }

    stream.write(`Arquivo analisado com falhas. Total de erros: ${errors.length}.\n`);

    // Write errors found
    errors.forEach(function(item) {
      lineNumber = parseInt(item['line']) < 10 ? '0' + item['line'] : item['line'];
      classification = mapping['errors'][item['class']];
      output = `${lineNumber}\t${classification}\t${item['value']}\n`;
      stream.write(output);
    });
  } else {
    stream.write(`\nArquivo analisado com sucesso. Nenhum erro foi encontrado.`);
  }

  stream.end();
});
