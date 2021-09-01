'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const {parseArguments} = require('./lib/args-parser');
const {getEpisodes, getMediaResources} = require('./lib/kakao-apis');

(async ({id, offset, limit}) => {
  let browser;
  try {
    const contentId = id;
    const episodes = await getEpisodes({contentId, offset, limit});

    // Creates a directory of content.
    const rootDir = path.join('.', String(contentId));
    if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);

    browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    for (const i in episodes) {
      const {id, seoId, readable} = episodes[i];

      if (!readable) {
        console.warn(`Cannot download '${seoId}', because it is paid episode`);
        continue;
      }

      await page.goto(`https://webtoon.kakao.com/viewer/${seoId}/${id}`);

      // Gets the number of images on this episode.
      const {files} = await getMediaResources(id);

      // Waits until all images are rendered.
      await page.waitForXPath(`//*[count(div[@data-index and starts-with(@class, "spacing_mx_")]//img[@src]) = ${files.length}]`, {timeout: 15 * 1000});

      const dataURLs = await page.evaluate(async () => {
        function requestBlobsAsync(blobURLs) {
          return Promise.all(blobURLs.map(blobURL => requestBlobAsync(blobURL)));
        }

        function requestBlobAsync(blobURL) {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onerror = reject;

            xhr.onload = () => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(xhr.response);
            };

            xhr.open('GET', blobURL);
            xhr.send();
          });
        }

        function getBlobURLs() {
          const elements = document.querySelectorAll('div[data-index][class*="spacing_mx_a"] img[src]');
          return Array.from(elements, img => img.src);
        }

        return await Promise.resolve(requestBlobsAsync(getBlobURLs()));
      });

      dataURLs.forEach((dataURL, j, arr) => {
        // Validates data URL.
        if (typeof dataURL !== 'string' || !dataURL.startsWith('data:')) {
          throw new Error(`Invalid Data URI: ${dataURL}`);
        }

        const [, mimeType, format, data] = dataURL.match(/^data:(.*?)(;base64)?,(.+)$/);
        const filename = `${seoId}-${String(j + 1).padStart(4, '0')}.webp`;
        const fileDir = path.join(rootDir, String(seoId));

        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);
        const pathname = path.join(fileDir, filename);

        fs.writeFile(pathname, data, 'base64', () => {
        });

        if (j === arr.length - 1) console.log(`Downloaded '${seoId}': ${arr.length} image(s)`);
      });
    }

  } catch (e) {
    console.error(e);
    if (browser) await browser.close();
  }
})(parseArguments(process.argv));
