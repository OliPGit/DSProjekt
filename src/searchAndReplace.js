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
  for (wordHash, i = 0; i < 20000; ++i) {
    wordHash[i] = i;
  }

  wordHash = shuffle(wordHash);
  wordHash.push('blacklist');
  wordHash.push('whitelist');

  $.each(wordHash, function (index, word) {
    console.log('word: ', word);
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
    return b.abbr.length - a.abbr.length;
  });
}

// NodeFilter function
function filter(node) {
  // Ignore any node that matches a selector in the list
  // and nodes that are empty or only whitespace
  if (
    !node.parentNode.matches(`#ignoreId, .ignoreClass`) &&
    !/^\s*$/.test(node.textContent)
  ) {
    // If passes test, return accept value
    return NodeFilter.FILTER_ACCEPT;
  }
  return false;
}

function findTextNodes() {
  // const n = document.getElementById("middle_col");
  // let walker = n.ownerDocument.createTreeWalker(n, NodeFilter.SHOW_TEXT, {acceptNode: filter});
  let treeRoot;

  if (`#main-content`.startsWith('#')) {
    treeRoot = document.getElementById(`${`#main-content`.slice(1)}`);
  } else {
    treeRoot = document.body;
  }

  const walker = document.createTreeWalker(
    treeRoot, // root
    NodeFilter.SHOW_TEXT, // nodes to include
    {
      acceptNode: filter,
    } // NodeFilter object
  );

  const textNodes = new Set();
  while (walker.nextNode()) {
    textNodes.add(walker.currentNode);
  }
  return textNodes;
}

function textNodeReplace(node, regex, handler) {
  let mom = node.parentNode,
    nxt = node.nextSibling,
    doc = node.ownerDocument,
    hits;
  if (regex.global) {
    while (node && (hits = regex.exec(node.nodeValue))) {
      regex.lastIndex = 0;
      node = handleResult(node, hits, handler.apply(this, hits));
    }
  } else if ((hits = regex.exec(node.nodeValue)))
    handleResult(node, hits, handler.apply(this, hits));

  function handleResult(node, hits, results) {
    var orig = node.nodeValue;
    node.nodeValue = orig.slice(0, hits.index);
    [].concat(create(mom, results)).forEach(function (n) {
      mom.insertBefore(n, nxt);
    });
    var rest = orig.slice(hits.index + hits[0].length);
    return rest && mom.insertBefore(doc.createTextNode(rest), nxt);
  }

  function create(el, o) {
    if (o.map)
      return o.map(function (v) {
        return create(el, v);
      });
    else if (typeof o === 'object') {
      var e = doc.createElementNS(o.namespaceURI || el.namespaceURI, o.name);
      if (o.attrs) for (let a in o.attrs) e.setAttribute(a, o.attrs[a]);
      if (o.content) [].concat(create(e, o.content)).forEach(e.appendChild, e);
      return e;
    } else return doc.createTextNode(o + '');
  }
}

function addAdPopovers(words) {
  for (const key of Object.keys(words)) {
    const textNodes = findTextNodes();

    for (const textNode of textNodes) {
      textNodeReplace(textNode, words[key].reg, function (matched) {
        if (matched)
          return {
            name: 'span',
            attrs: {
              class: 'blacklisted',
            },
            content: `XXX`,
          };
      });
    }
  }
}

this.onmessage = function (e) {
  if (e.data.wMessage !== this.undefined) {
    //console.log('inside worker: ', e.data.wMessage.htmlC);
    console.log(createWordArr(e.data.wMessage.htmlC));
  }
};
