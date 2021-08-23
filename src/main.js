/**
 * Downloads kakao webtoons.
 *
 * @see https://jaenjoy.tistory.com/36
 * @see https://dev.to/nombrekeff/download-file-from-blob-21ho
 * @see https://superuser.com/questions/1364468/downloading-blob-image/1364474
 */
function downloadKakaoWebtoons() {
  const sleep = (milliseconds) => {
    const timeStart = new Date().getTime();
    while (true) {
      const elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) break;
    }
  }

  const images = document.querySelectorAll('div[data-index][class*="spacing_mx_a"] img[src]');
  if (!images || !images.length) return console.log('Cannot find images in this webpage.');

  const a = document.createElement('a');

  Array.from(images).map(img => img.src).forEach((src, i) => {
    a.href = src;
    a.download = `${String(i + 1).padStart(3, '0')}.webp`;

    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true, 
        cancelable: true, 
        view: window,
      })
    );

    // See https://stackoverflow.com/questions/53560991/automatic-file-downloads-limited-to-10-files-on-chrome-browser
    if ((i + 1) % 5 === 0) sleep(1000);
  });

  return images.length;
}
