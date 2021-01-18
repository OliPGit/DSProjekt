function appendHtmlToBody(htmlString, element) {
  const el = document.querySelector(element);
  const html = htmlString;
  el.insertAdjacentHTML('beforeend', html);
}

function createAdPopoverContainer() {
  const html = `<!-- Blacklist Word Container -->
    <div class="blacklist-word-container" id="blacklist-word-container">
        <div id="blacklist-word-hidden-container" style="display: none;">
        </div>
    </div>`;

  const el = document.querySelector('body');
  el.insertAdjacentHTML('beforeend', html);
}

function createAdPopoverBody() {
  return `<div class="blacklist-popover-body">
  <p>This is a test</p>
  </div>`;
}

function createAdPopoverContent() {
  const content = `<div class="blacklist-popover" id="blacklistedWord">
        <div class="blacklist-popover-title">
          <p>Blacklisted Word</p>
        </div>
        ${createAdPopoverBody()}
    </div>`;
  return content;
}

function runTippy() {
  tippy('.blacklist-word', {
    content(reference) {
      if (!reference.getAttribute('data-template')) {
        const word = $(reference).text();
        $(reference).attr('data-template', `blacklistedWord`);
      }
      const id = reference.getAttribute('data-template');
      const template = document.getElementById(id);
      return template.innerHTML;
    },
    onTrigger(instance, event) {
      //
    },
    onHide(instance) {
      //
    },
    onShow(instance) {
      tippy.hideAll({ exclude: instance });
    },
    allowHTML: true,
    trigger: 'click',
    appendTo: document.getElementById('blacklist-word-container'),
    interactive: true,
    interactiveBorder: 10,
    interactiveDebounce: 35,
    maxWidth: 'none',
    placement: 'auto',
    theme: 'light-border',
    animation: 'scale',
  });
}

// NodeFilter function
function filter(node) {
  // Ignore any node that matches a selector in the list
  // and nodes that are empty or only whitespace
  if (
    !node.parentNode.matches('.ignore, .ignore *') &&
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
              class: 'blacklist-word',
              'data-template': `blacklistedWord`,
            },
            content: matched,
          };
      });
    }
  }
}

jQuery(($) => {
  const htmlContent = $('#main-content  > :not(.ignore)').text();
  console.log($('#main-content > :not(.ignore)').text());
  console.log(document.getElementById(`${`#main-content`.slice(1)}`));
  createAdPopoverContainer();

  if (window.Worker) {
    console.log('Worker');
    const wfWorker = new Worker('src/searchAndReplace.js');
    const wfWMessage = { wMessage: { htmlC: htmlContent } };
    wfWorker.postMessage(wfWMessage);

    wfWorker.onmessage = function (e) {
      console.log('In main.js: ', e.data.wordArr);
      addAdPopovers(e.data.wordArr);
      appendHtmlToBody(
        createAdPopoverContent(),
        '#blacklist-word-hidden-container'
      );
      runTippy();
    };
  } else {
    console.log('No Worker');
  }

  /*
  insertionQ('#main-content div').every(function (element) {
    console.log(`--- insertionQ('div').every(function (element) ---`);
    console.log(element); 
  });
*/
  insertionQ('#main-content div').summary(function (arrayOfInsertedNodes) {
    console.log(
      `+++ insertionQ('div').summary(function(arrayOfInsertedNodes) +++`
    );
    console.log(arrayOfInsertedNodes);

    arrayOfInsertedNodes.forEach(function (element, index) {
      console.log(`element: ${$(element).text()}`);
    });
  });
});
