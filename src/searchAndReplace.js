this.onmessage = function (e) {
  if (e.data.wMessage !== this.undefined) {
    console.log('inside worker: ', e.data.wMessage);
  }
};
