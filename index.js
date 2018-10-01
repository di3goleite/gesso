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

  const classifications = classifier.run(result);
  console.log('classification ====================');
  console.log(classifications);

  let stream = fs.createWriteStream("teste/output.txt");
  stream.once("open", fd => {
    const map = require("./common/classificationMap").map;
    const mapKeys = Object.keys(map);
    const mapValues = Object.values(map);

    // Number of Errors found in analysis
    let err = 0;
    let errors = [];

    classifications.forEach(obj => {
      // Mapping classification to class abreviation
      let position = mapKeys.indexOf(obj.class);
      let mappedClass = mapValues[position];

      let line = obj.line;
      if(obj.line < 10) line = "0" + obj.line;

      let writeData = line + "\t" + mappedClass + "\t" + obj.value + "\n";
      if(obj.type == "error") {
        // Counting errors
        err++;
        // Push on array to be written on the end of the file
        errors.push(writeData);
      }
      else stream.write(writeData);
    })

    if(err === 0) stream.write("\n\nArquivo analisado com sucesso. Nenhum erro foi encontrado");
    else {
      stream.write("\nArquivo analisado com falhas. " + err + " erros foram encontrados.\n\n")
      errors.forEach(obj => {
        stream.write(obj);
      })
    }
    stream.end();
  });
});
