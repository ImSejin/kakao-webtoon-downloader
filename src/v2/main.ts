import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { parseArguments } from './lib/args-parser';
import { sanitizeFileName } from './lib/unallowable-replacer';
import { getContent, getEpisodes, getMediaResources } from './lib/kakao-apis';

(async ({ id, offset, limit }) => {
  let browser;

  try {
    const contentId = Number(id);
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    const episodes = await getEpisodes(contentId, offset, limit);
    if (!episodes.length) return;

    const { title, authors } = await getContent(contentId);

    // Creates a directory of content.
    const authorNames = Array.from(
      new Set(
        authors
          .sort((a, b) => a.order - b.order)
          .filter(({ type }) => type === 'AUTHOR' || type === 'ILLUSTRATOR')
          .map((it) => it.name),
      ),
    ).join(', ');
    const rootDir = path.join('/', `D_${sanitizeFileName(title)} - ${authorNames}`);
    if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const i in episodes) {
      const { id, seoId, title, readable } = episodes[i];

      if (!readable) {
        console.warn(`Cannot download '${seoId}', because it is paid episode`);
        continue;
      }

      await page.goto(`https://webtoon.kakao.com/viewer/${seoId}/${id}`);

      // Gets the number of images on this episode.
      const { files } = await getMediaResources(id);

      // Waits until all images are rendered.
      await page.waitForXPath(
        `//*[count(div[@data-index and starts-with(@class, "mx-auto max-w-")]//img[@src]) = ${files.length}]`,
        { timeout: 15 * 1000 },
      );

      const dataURLs = await page.evaluate(async () => {
        function requestBlobsAsync(blobURLs) {
          return Promise.all(blobURLs.map((blobURL) => requestBlobAsync(blobURL)));
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
          const elements = document.querySelectorAll('div[data-index][class^="mx-auto max-w-"] img[src^="blob:http"]');
          return Array.from(elements, (img: HTMLImageElement) => img.src);
        }

        return await requestBlobsAsync(getBlobURLs());
      });

      const episodeNo = seoId.replace(/^.+-(\d+)$/, '$1');

      dataURLs.forEach((dataURL, j, arr) => {
        // Validates data URL.
        if (typeof dataURL !== 'string' || !dataURL.startsWith('data:')) {
          throw new Error(`Invalid Data URI: ${dataURL}`);
        }

        const fileDir = path.join(rootDir, `${episodeNo.padStart(4, '0')} - ${sanitizeFileName(title)}`);
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);

        const filename = `${String(j).padStart(4, '0')}.webp`;
        const pathname = path.join(fileDir, filename);

        // const [, mimeType, format, data] = dataURL.match(/^data:(.*?)(;base64)?,(.+)$/);
        const [, , , data] = dataURL.match(/^data:(.*?)(;base64)?,(.+)$/);
        fs.writeFile(pathname, data, 'base64', () => {});

        if (j === arr.length - 1) console.log(`Downloaded '${seoId}': ${arr.length} image(s)`);
      });
    }
  } catch (e) {
    console.error(e);
    if (browser) await browser.close();
  }
})(parseArguments(process.argv));
