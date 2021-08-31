'use strict';

/**
 * Downloads kakao webtoons.
 *
 * @see https://jaenjoy.tistory.com/36
 * @see https://dev.to/nombrekeff/download-file-from-blob-21ho
 * @see https://superuser.com/questions/1364468/downloading-blob-image/1364474
 */
function downloadKakaoWebtoons({chunkSize = 5, appendPrefix = false}) {
  // See https://stackoverflow.com/questions/53560991/automatic-file-downloads-limited-to-10-files-on-chrome-browser
  if (chunkSize <= 0 || chunkSize > 10) {
    throw new Error(`chunkSize must be positive and less than or equal to 0, but it is '${chunkSize}'`);
  }

  const sleep = (milliseconds) => {
    const timeStart = new Date().getTime();
    while (true) {
      const elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) break;
    }
  };

  // "헤븐-투-헬-054-0001.webp" or "0001.webp"
  const prefix = appendPrefix
      ? ((text) => text.substring(0, text.indexOf('/')))(window.decodeURI(location.pathname).replace('/viewer/', '')) + '-'
      : '';

  const images = document.querySelectorAll('div[data-index][class*="spacing_mx_a"] img[src]');
  if (!images || !images.length) return console.log('Cannot find images in this webpage.');

  const a = document.createElement('a');

  Array.from(images, img => img.src).forEach((src, i) => {
    a.href = src;
    a.download = `${prefix}${String(i + 1).padStart(4, '0')}.webp`;

    a.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
    );

    if ((i + 1) % chunkSize === 0) sleep(1000);
  });

  return images.length;
}
