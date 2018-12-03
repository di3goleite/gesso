const fs = require('fs');
const path = require('path');

function getFilePaths(folder) {
  return new Promise(function(resolve, reject) {
    // Read all files from ./teste/ directory
    fs.readdir(folder, function (error, files) {
      if (error) {
        reject(error);
      } else {
        files = files.filter(function(file) {
          return file.charAt(0) !== '.';
        })
        .filter(function(file) {
          return !file.includes('out');
        });

        resolve(files);
      }
    });
  });
}

function doLexicalAnalysis(file) {
  const lexicalAnalyzer = require('./lib/lexicalAnalyzer');
  const classifier = require('./lib/classifier');

  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(error, data) {
      if (error) {
        reject(error);
      } else {
        let result = lexicalAnalyzer.cleanUp(data);
        result = lexicalAnalyzer.split(result);
        result = lexicalAnalyzer.bandaid(result);
        result = classifier.run(result);

        const stream = fs.createWriteStream(file + '.lexical.out');
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
        resolve();
      }
    });
  });
}

async function run() {
  try {
    const TARGET_DIRECTORY = path.join(__dirname, 'teste');
    const files = await getFilePaths(TARGET_DIRECTORY);

    for (const file of files) {
      await doLexicalAnalysis(path.join(TARGET_DIRECTORY, file));
    }
  } catch(e) {
    console.log(e.message);
  }
}

// Application bootstrap
run();
