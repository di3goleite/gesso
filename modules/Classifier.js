const regexes = {
  identifier: /^([a-z]|[A-Z]){1}([a-z]|[A-Z]|[0-9]|_)*/,
  reservedWord: /(^class$|^const$|^variables$|^method$|^return$|^main$|^if$|^then$|^else$|^while$|^read$|^write$|^void$|^int$|^float$|^bool$|^string$|^true$|^false$|^extends$)/,
  number: /^\-?\s*[0-9]+(\.[0-9]+)?$/,
  arithmeticOp: /(^\+$|^\-$|^\*$|^\/$|^\+\+$|^\-\-$)/,
  relationalOp: /(^\!\=$|^\=\=$|^<$|^<\=$|^>$|^>\=$|^=$)/,
  logicOp: /(^\!$|^&&$|^\|\|$)/,
  lineComment: /^\/\//,
  blockComment: /^\/\*.+\*\/$/,
  delimiter: /(^;$|^,$|^\($|^\)$|^\[$|^\]$|^\{$|^\}$|^\.$)/,
  characterSequence: /^\"([^\"]|\\\")*\"$/
}

function classify (word) {
  const values = Object.values(regexes);
  const keys = Object.keys(regexes);
  let output = "";

  values.forEach((regex, index) => {
    if(regex.test(word)) {
      output = keys[index];
    }
  });

  return output;
}

module.exports = {
  classifyOne: function(word) {
    return classify(word);
  },

  classifyAll: function(words) {
    let result = [];
    
    words.forEach(word => {
      let classification = classify(word)
      result.push(classification);
    });

    return result;
  }
}