const lexicalStructure = require('./../common/lexicalStructure');
const regularExpressions = require('./../common/regularExpressions');

function cleanUp(str) {
  let output = '';
  let specialCondition = false;
  const delimiterRegex = regularExpressions.lexical.DELIMITER;

  for (let i = 0; i < str.length; i++) {
    if (!specialCondition) {
      if (str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\t') {
        output = output + str[i];
      } else if (i > 0 && str[i - 1] === '-') {
        specialCondition = true;
        output = output + str[i];
      }
    } else {
      if (delimiterRegex.test(str[i])) {
        specialCondition = false;
      }
      output = output + str[i];
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

module.exports = { cleanUp, split };