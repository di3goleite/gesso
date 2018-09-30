const lexicalStructure = require('./../common/lexicalStructure');
const regularExpressions = require('./../common/regularExpressions');

function cleanUp(str) {
  const delimiterRegex = regularExpressions.lexical.DELIMITER;
  let isANegativeNumber = false;
  let isALineComment = false;
  let isABlockComment = false;
  let numberOfLines = 1;
  let output = '';
  let list = [];

  for (let i = 0; i < str.length; i++) {
    if (!isANegativeNumber && !isALineComment && !isABlockComment) {
      if (str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\t') {
        if (str[i] === '/' && str[i + 1] === '/') {
          isALineComment = true;
        } else if (str[i] === '/' && str[i + 1] === '*') {
          isABlockComment = true;
        } else {
          output = output + str[i];
        }
      } else if (i > 0 && str[i - 1] === '-') {
        isANegativeNumber = true;
        output = output + str[i];
      }
    } else if (isANegativeNumber) {
      if (delimiterRegex.test(str[i])) {
        isANegativeNumber = false;
      }
      output = output + str[i];
    } else if (isALineComment) {
      if (str[i] === '\n') {
        isALineComment = false;
      }
    } else if (isABlockComment) {
      if (str[i] === '*' && str[i + 1] === '/') {
        isABlockComment = false;
        i = i + 1;
      }
    }

    // Save each line with its respective number
    if (str[i] === '\n') {
      if (output !== '') {
        list.push({line: numberOfLines, value: output});
      }

      numberOfLines = numberOfLines + 1;
      output = '';
    }
  }

  // Get the last line
  list.push({line: numberOfLines, value: output});

  return list;
}

function split(list) {
  const categories = lexicalStructure.categories;
  let auxList = [];
  let parts = [];
  let regex = '';

  Object.keys(categories).forEach(function(category) {
    categories[category].forEach(function(c) {
      regex = new RegExp('(?<=' + c + ')|(?=' + c + ')');

      for (let i = 0; i < list.length; i++) {
        parts = list[i]['value'].split(regex);

        if (parts.length > 1) {
          parts = parts.map(function(part) {
            return {line: list[i]['line'], value: part};
          });

          auxList = list.slice(0, i);
          auxList = auxList.concat(parts);
          auxList = auxList.concat(list.slice(i + 1, list.length));
          list = auxList;
        }
      }
    });
  });

  return list;
}

function bandaid(list) {
  const arithmeticOperationRegex = regularExpressions.lexical.ARITHMETIC_OPERATION;
  const relationalOperationRegex = regularExpressions.lexical.RELATIONAL_OPERATION;
  const numberRegex = regularExpressions.lexical.NUMBER;

  let output = [];
  let counter = 0;
  let charactersChain = '';

  for (let i = 0; i < list.length; i++) {
    if (i + 1 <= list.length) {
      // Negative number special condition
      if (list[i]['value'] === '-' && numberRegex.test(list[i + 1]['value'])) {
        // Float point number special condition
        if (i + 3 <= list.length && list[i + 2]['value'] === '.' && numberRegex.test(list[i + 3]['value'])) {
          output.push({line: list[i]['line'], value: ((list[i]['value'].concat(list[i + 1]['value'])).concat(list[i + 2]['value'])).concat(list[i + 3]['value'])});
          i = i + 3;
        // If the previous element is a number so this current one is an operator
        } else if (numberRegex.test(list[i - 1]['value'])) {
          output.push({line: list[i]['line'], value: list[i]['value']});
        } else {
          output.push({line: list[i]['line'], value: list[i]['value'].concat(list[i + 1]['value'])});
          i = i + 1;
        }
      // Characters chain special condition
      } else if (list[i]['value'].indexOf('\"') === 0) {
        charactersChain = list[i]['value'];

        if ((list[i]['value'][list[i]['value'].length - 1] !== '\"') && (i + 1 < list.length)) {
          i = i + 1;

          while (i < list.length && list[i]['value'].indexOf('\"') < 0) {
            charactersChain = charactersChain + list[i]['value'];
            i = i + 1;
          }

          i = i - 1;
        }

        output.push({line: list[i]['line'], value: charactersChain});
      // Arithmetic operator special condition
      } else if (arithmeticOperationRegex.test(list[i]['value']) && arithmeticOperationRegex.test(list[i + 1]['value'])) {
        output.push({line: list[i]['line'], value: list[i]['value'].concat(list[i + 1]['value'])});
        i = i + 1;
      // Relational operator special condition
      } else if ((relationalOperationRegex.test(list[i]['value']) && relationalOperationRegex.test(list[i + 1]['value'])) || (list[i]['value'] === '!' && list[i + 1]['value'] === '=')) {
        output.push({line: list[i]['line'], value: list[i]['value'].concat(list[i + 1]['value'])});
        i = i + 1;
      } else {
        output.push({line: list[i]['line'], value: list[i]['value']});
      }
    } else {
      output.push({line: list[i]['line'], value: list[i]['value']});
    }
  }

  return output;
}

module.exports = { cleanUp, split, bandaid };