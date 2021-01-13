this.onmessage = function (e) {
  if (e.data.wMessage !== this.undefined) {
    console.log(e.data.wMessage.htmlContent);
  }
};
