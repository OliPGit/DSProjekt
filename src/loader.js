function loadScripts(sources) {
  sources.forEach((src) => {
    console.log(`loading ${src}`);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // The sequence of the script loading needs to be controled
    script.async = false;
    script.src = src;
    document.body.appendChild(script);
    // const s = document.getElementsByTagName('script')[0];
    // s.parentNode.insertBefore(script, s)
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
    'src/extern/insQ.js',
  ]);
  loadAdCss();
});
