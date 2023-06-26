<h1 align="center">Kakao Webtoon Downloader</h1>

<p align="center">Downloader for kakao webtoons</p>

<p align="center">※ <i>The user is responsible for everything that happens using this program.</i></p>

## Getting started

### v1

- Copy `src/v1/main.js`.
- Paste it to console in chrome devtools.
- Run that function.

### v2

- Install node.js 10 or later.
- Run the below command and you can find images at root directory.

#### Usage

```bash
npm start id=<content_id> [offset=<offset>] [limit=<limit>]
```

- id (required): Identifier of webtoon on URL.
- offset (optional): start index of episode you want to download. (default is 0)
- limit (optional): the number of episodes you want to download. (default is 30)

#### Example

If you want to download through this URL `https://webtoon.kakao.com/content/하렘생존기/1776`.

```bash
npm start id=1776
```

Downloads the episodes of that webtoon from the first to ep.30.

```bash
npm start id=1776 offset=9
```

Downloads the episodes of that webtoon from the ep.10 to ep.40.

```bash
npm start id=1776 offset=10 limit=3
```

Downloads the episodes of that webtoon from ep.11 to ep.14.
