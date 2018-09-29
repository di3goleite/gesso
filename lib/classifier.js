const regularExpressions = require('./../common/regularExpressions');

function checkClassification(regexes, classifications, lexeme) {
  // Classification result
  let result = '';

  // Iterate each of the regexes searching for a match
  regexes.forEach((regex, index) => {
    if(regex.test(lexeme)) {
      // Returns the classification a match is found
      result = classifications[index];
      return;
    }
  });

  return result;
}

function classifyLexeme(lexeme) {
  const regexes = Object.values(regularExpressions.lexical);
  const classifications = Object.keys(regularExpressions.lexical);
  return checkClassification(regexes, classifications, lexeme);
}

function classifyError(error) {
  const regexes = Object.values(regularExpressions.errors);
  const classifications = Object.keys(regularExpressions.errors);
  return checkClassification(regexes, classifications, error);
}

function run(lexems) {
  const result = [];
  let classification = '';

  lexems.forEach(lexeme => {
    classification = classifyLexeme(lexeme);

    // Lexeme classification found
    if (classification.length > 0) {
      result.push(classification);
    } else {
      // No lexeme found, proceeding to error classification
      const error = classifyError(lexeme);
      result.push(error);
    }
  });

  return result;
}

module.exports = { run };