function loadScripts(sources) {
  sources.forEach((src) => {
    console.log(`loading ${src}`);
    var script = document.createElement('script');
    script.src = src;
    script.async = false; //<-- the important part
    document.body.appendChild(script); //<-- make sure to append to body instead of head
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loadScripts([
    'src/extern/jquery.min.js',
    'src/extern/popper.js',
    'src/extern/tippy-bundle.umd.js',
    'src/main.js',
    //'src/searchandreplaceLocal.js',
  ]);
});
