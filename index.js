const fs = require('fs');

function awesomeSplit(str) {
  let temp = '';
  const output = [];

  for(let i=0; i < str.length; i++) {
    if (str[i] === ' ' || str[i] === '\n' || str[i] == '\t') {
      output.push(temp);
      temp = '';
    } else {
      temp = temp + str[i];
    }
  }

  return output;
}

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  const result = awesomeSplit(data)
  console.log(result);
});

