function loadScripts(sources) {
  sources.forEach((src) => {
    console.log(`loading ${src}`);
    var script = document.createElement('script');
    script.src = src;
    // scripts are depending on the previous one, make sure they are loaded after the previous is finished
    script.async = false;
    document.body.appendChild(script);
  });
}

function loadAdCss() {
  const cssId = 'blacklistCss';
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'src/extern/light-border.css';
    link.media = 'all';
    head.appendChild(link);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadScripts([
    'src/extern/jquery.min.js',
    'src/extern/popper.js',
    'src/extern/tippy-bundle.umd.js',
    'src/main.js',
    //'src/searchandreplaceLocal.js',
  ]);
  loadAdCss();
});
