jQuery(($) => {
  const htmlContent = $('#main-content').text();

  if (window.Worker) {
    console.log('Worker');
    const wfWorker = new Worker('src/searchAndReplace.js');
    const wfWMessage = { wMessage: { htmlC: htmlContent } };
  } else {
    console.log('No Worker');
  }
});
