const lexicalStructure = require('./../common/lexicalStructure');

// Apply special condition rules
function applySpecialRules() {
  let temp = '';
  let specialCondition = false;
  const output = [];

  for(let i=0; i < str.length; i++) {
    if (str[i] === '-') {
      specialCondition = true;
      temp = temp + str[i];
    } else if (specialCondition) {
      if (str[i] === ';') {
        output.push(temp);
        output.push(str[i]);

        specialCondition = false;
        temp = '';
      } else {
        temp = temp + str[i];
      }
    } else if (str[i] === ' ' || str[i] === '\n' || str[i] === '\t') {
      if (temp !== '' && temp !== ' ' && temp !== '\n' && temp !== '\t') {
        output.push(temp);
      }

      temp = '';
    } else {
      temp = temp + str[i];
    }
  }

  return output;
}

function run(str) {
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

module.exports = { run };