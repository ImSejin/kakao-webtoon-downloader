import type { AxiosRequestConfig } from 'axios';

/**
 * https://axios-http.com/docs/req_config
 */
const axiosConfig: Readonly<AxiosRequestConfig> = {
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'accept-language': 'ko',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    Cookie: '',
    Host: 'gateway-kw.kakao.com',
    Origin: 'https://webtoon.kakao.com',
    Pragma: 'no-cache',
    Referer: 'https://webtoon.kakao.com/',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  },
  timeout: 15 * 1000, // 15 seconds
};

export { axiosConfig };
