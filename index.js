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
    classifications.forEach(obj => {
      // Counting errors
      if(obj.type == "error") err++;

      // Mapping classification to class abreviation
      let position = mapKeys.indexOf(obj.class);
      let mappedClass = mapValues[position]

      stream.write(obj.line + "\t" + mappedClass + "\t" + obj.value + "\n"); 
    })

    if(err === 0) stream.write("\n\nArquivo analisado com sucesso. Nenhum erro foi encontrado");
    else stream.write("\n\nArquivo analisado com falhas. " + err + " erros foram encontrados.")

    stream.end();
  });
});
