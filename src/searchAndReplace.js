// Turn blacklisted words into regular expressions
function createRx(word, hasSymbol = false) {
  let regword = word;
  if (!hasSymbol) {
    return new RegExp(`\\b${regword}\\b`, 'g');
  }
  if (/\W|[_]/g.test(regword.charAt(0))) {
    regword = `${regword}\\b`;
  }
  if (/\W|[_]/g.test(regword.slice(-1))) {
    regword = `\\b${regword}`;
  }
  return new RegExp(regword, 'g');
}

function shuffle(array) {
  var tmp,
    current,
    top = array.length;
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
}

// Make an array of blacklisted words occur on the webpage
function createWordArr(contentString) {
  const wordArr = [];
  const htmlContent = contentString;

  let wordHash = [];
  for (wordHash, i = 0; i < 100000; ++i) {
    wordHash[i] = i;
  }

  wordHash = shuffle(wordHash);
  wordHash.push('blacklist1');
  wordHash.push('blacklist2');
  wordHash.push('blacklist3');
  wordHash.push('blacklist4');
  wordHash.push('blacklist5');
  wordHash.push('blacklist6');
  wordHash.push('blacklist7');
  wordHash.push('blacklist8');
  wordHash.push('blacklist9');
  wordHash.push('blacklist0');
  wordHash.push('blacklist10');
  wordHash.push('blacklist11');
  wordHash.push('blacklist12');
  wordHash.push('blacklist13');
  wordHash.push('blacklist14');
  wordHash.push('blacklist15');
  wordHash.push('blacklist16');
  wordHash.push('blacklist17');
  wordHash.push('blacklist18');
  wordHash.push('blacklist19');
  wordHash.push('whitelist');

  wordHash.forEach(function (word, index) {
    let reg = null;
    // if word hasn't any symbols
    if (!/\W|[_]/g.test(word)) {
      reg = createRx(word);
    } else {
      // use brekits [ ] for that symbols
      const wordWithSymbols = word.replace(/\W|_/g, '[$&]');
      reg = createRx(wordWithSymbols, true);
    }
    if (htmlContent.match(reg)) {
      wordArr.push({
        word,
        reg,
      });
    }
  });
  const sortedArr = sortWordArray(wordArr);
  return sortedArr;
}

// Sort the array from longest to shortest word.
function sortWordArray(wordArray) {
  return wordArray.sort(function (a, b) {
    // ASC  -> a[0].length - b[0].length
    // DESC -> b[0].length - a[0].length
    return b.word.length - a.word.length;
  });
}

this.onmessage = function (e) {
  if (e.data.wMessage !== this.undefined) {
    this.postMessage({ wordArr: createWordArr(e.data.wMessage.htmlC) });
  }
};
