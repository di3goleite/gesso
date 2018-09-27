const fs = require('fs');
const classifier = require('./modules/Classifier')

function awesomeSplit(str) {
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

fs.readFile('./teste/program.pr', 'utf8', function(error, data) {
  console.log('input ====================');
  console.log(data);

  console.log('characters ====================');
  console.log(data.split(''));
  console.log('');

  const result = awesomeSplit(data)

  console.log('ouput ====================');
  console.log(result);

  const classifications = classifier.classifyAll(result);
  console.log(classifications);
});

