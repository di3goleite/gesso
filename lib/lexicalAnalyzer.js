const lexicalStructure = require('./../common/lexicalStructure');
const regularExpressions = require('./../common/regularExpressions');

function cleanUp(str) {
  const delimiterRegex = regularExpressions.lexical.DELIMITER;
  let isANegativeNumber = false;
  let isALineComment = false;
  let isABlockComment = false;
  let output = '';

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
  }

  return output;
}

function split(str) {
  const categories = lexicalStructure.categories;
  let result = [str];
  let auxList = [];
  let parts = [];
  let regex = '';

  Object.keys(categories).forEach(function(category) {
    categories[category].forEach(function(c) {
      regex = new RegExp('(?<=' + c + ')|(?=' + c + ')');

      for (let i = 0; i < result.length; i++) {
        parts = result[i].split(regex);

        if (parts.length > 1) {
          auxList = result.slice(0, i);
          auxList = auxList.concat(parts);
          auxList = auxList.concat(result.slice(i + 1, result.length));
          result = auxList;
        }
      }
    });
  });

  return result;
}

function bandaid(list) {
  const arithmeticOperationRegex = regularExpressions.lexical.ARITHMETIC_OPERATION;
  const relationalOperationRegex = regularExpressions.lexical.RELATIONAL_OPERATION;
  const numberRegex = regularExpressions.lexical.NUMBER;

  let output = [];

  for (let i = 0; i < list.length; i++) {
    if (i + 1 <= list.length) {
      // Negative number special condition
      if (list[i] === '-' && numberRegex.test(list[i + 1])) {
        // Float point number special condition
        if (i + 3 <= list.length && list[i + 2] === '.' && numberRegex.test(list[i + 3])) {
          output.push(((list[i].concat(list[i + 1])).concat(list[i + 2])).concat(list[i + 3]));
          i = i + 3;
        // If the previous element is a number so this current one is an operator
        } else if (numberRegex.test(list[i - 1])) {
          output.push(list[i]);
        } else {
          output.push(list[i].concat(list[i + 1]));
          i = i + 1;
        }
      // Characters chain special condition
      } else if (list[i] === '"' && list[i + 2] === '"') {
        output.push((list[i].concat(list[i + 1]).concat(list[i + 2])));
        i = i + 2;
      // Arithmetic operator special condition
      } else if (arithmeticOperationRegex.test(list[i]) && arithmeticOperationRegex.test(list[i + 1])) {
        output.push(list[i].concat(list[i + 1]));
        i = i + 1;
      // Relational operator special condition
      } else if ((relationalOperationRegex.test(list[i]) && relationalOperationRegex.test(list[i + 1])) || (list[i] === '!' && list[i + 1] === '=')) {
        output.push(list[i].concat(list[i + 1]));
        i = i + 1;
      } else {
        output.push(list[i]);
      }
    } else {
      output.push(list[i]);
    }
  }

  return output;
}

module.exports = { cleanUp, split, bandaid };