// https://github.com/lwenn/pdf-viewer-easy/blob/master/src/pdf.pack.js
// need to add <script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
function pdfRender(url, container = 'body', eachRender = 20) {
  PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  const PIXEL_RATIO = (function () {
    let ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
     bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
  })();
    let pageHeight
    let renderCount = 1
    startRender()

    function render (pdf, pageNum) {
      pdf.getPage(pageNum).then(function(page) {
        pageHeight = pageHeight || page.getViewport(1).height
        let viewport = page.getViewport(window.innerWidth / page.getViewport(1).width)
        let canvas = document.createElement('canvas');
        canvas.id = `pdfPage${pageNum}`
        let context = canvas.getContext('2d');
        canvas.height = viewport.height * PIXEL_RATIO;
        canvas.width = viewport.width * PIXEL_RATIO;
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';
        context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
        document.querySelector(container).appendChild(canvas);
        page.render({
          canvasContext: context,
          viewport: viewport
        }).then(function () {
          if (pageNum < pdf.numPages && pageNum < (renderCount * eachRender + 1)) {
            render(pdf, ++pageNum)
          }
        });
      });
    }
    window.addEventListener('scroll', function () {
      if (document.querySelector(container).scrollTop > (renderCount * eachRender - 5) * pageHeight) {
        renderCount++
        startRender()
      }
    })
  function startRender() {
    PDFJS.getDocument(url).promise.then(function(pdf) {
      render(pdf, (renderCount - 1) * eachRender + 1)
    }, function (reason) {
      console.error(reason);
    });
  }
}
