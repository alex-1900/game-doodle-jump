const fs = require('fs');

const STEP_NUMBER = 1000;

function makeRandom(min, max) {
  const range = max - min;   
  const rand = Math.random();   
  return(min + Math.round(rand * range));  
}

function isInline() {
  var random = makeRandom(0, 4);
  return random === 3;
}

function direction() {
  if (makeRandom(0, 7) === 5) {
    return makeRandom(0, 1) ? 2 : -2;
  }
  return 0;
}

function getMultipleAlpha() {
  const multipleAlpha = [];
  const alphaList = [[0.1, 0.2], [0.4, 0.5], [0.7, 0.8]];
  const times = makeRandom(2, 3);
  let swap = 2;
  for (let i = 0; i < times; i++) {
    let range = makeRandom(0, swap);
    const index = makeRandom(0, 1);
    multipleAlpha.push(alphaList[range][index]);
    delete alphaList[range];
    while(range < swap) {
      alphaList[range] = alphaList[range+1];
      range++;
    }
    swap--;
  }
  return multipleAlpha;
}

function getBeta() {
  var random = makeRandom(0, 8);
  return parseFloat(`0.1${random}`);
}

function getAlpha() {
  var random = makeRandom(1, 8);
  return parseFloat(`0.${random}`);
}

const list = [];

function putLine() {
  let beta = getBeta();
  if (isInline()) {
    const multipleAlpha = getMultipleAlpha();
    multipleAlpha.forEach((alpha, index) => {
      beta = index == 0 ? beta : 0;
      list.push([alpha, beta]);
    });
    return list;
  }
  const alpha = getAlpha();
  const direct = direction();
  list.push([alpha, beta, direct]);
}

for (let i = 0; i < STEP_NUMBER; i++) {
  putLine();
}

list.unshift([0.2, 0.1], [0.5, 0], [0.75, 0]);

const code = `
function getBoards(window, document) {
  return ${JSON.stringify(list)}
}
`;

fs.writeFile('./src/boards.js', code, err => {
  if (err) {
    throw err;
  }
  console.log('The file has been saved!');
});
// console.log(list);