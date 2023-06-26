import axios from 'axios';
import { axiosConfig } from '../config/axios-config';
import { Episode } from '../model/episode';
import { Media } from '../model/media';
import { Content } from '../model/content';

const $axios = axios.create(axiosConfig);

/**
 * Returns content.
 *
 * @param {number} contentId content id
 * @returns {Promise<Content>}
 */
const getContent = async (contentId: number) => {
  if (contentId <= 0) {
    throw new Error(`contentId must be greater than 0, but it is '${contentId}'`);
  }

  // https://gateway-kw.kakao.com/decorator/v1/decorator/contents/1299
  const baseUrl = 'https://gateway-kw.kakao.com/decorator/v1/decorator/contents';
  const { data } = await $axios.get(`${baseUrl}/${contentId}`);

  return data.data as Content;
};

/**
 * Returns episodes.
 *
 * @param {number} contentId content id
 * @param {number} offset offset
 * @param {number} limit limit
 * @returns {Promise<Episode[]>}
 */
const getEpisodes = async (contentId: number, offset: number, limit: number) => {
  if (contentId <= 0) {
    throw new Error(`contentId must be greater than 0, but it is '${contentId}'`);
  }
  if (offset < 0) {
    throw new Error(`offset must be zero or positive, but it is '${offset}'`);
  }
  if (limit <= 0) {
    throw new Error(`limit must be greater than 0, but it is '${limit}'`);
  }

  // https://gateway-kw.kakao.com/episode/v1/views/content-home/contents/1299/episodes?sort=-NO&offset=0&limit=30
  const baseUrl = 'https://gateway-kw.kakao.com/episode/v1/views/content-home/contents';

  const params = {
    sort: 'NO', // or '-NO'
    offset,
    limit,
  };

  const { data } = await $axios.get(`${baseUrl}/${contentId}/episodes`, { params });
  return data.data.episodes as Episode[];
};

/**
 * Returns media resources of the content.
 *
 * @param id episode number
 * @returns {Promise<Media>}
 */
const getMediaResources = async (id: number) => {
  if (id <= 0) {
    throw new Error(`id must be greater than 0, but it is '${id}'`);
  }

  // https://gateway-kw.kakao.com/episode/v1/views/viewer/episodes/109133/media-resources
  const baseUrl = 'https://gateway-kw.kakao.com/episode/v1/views/viewer/episodes';

  const payload = {
    download: false,
    id,
    nonce: Math.random().toString(36).substring(2), // Cryptographic nonce: 'nl49iwoba1h'
    timestamp: String(Date.now()), // '1630399812880'
    type: 'AES_CBC_WEBP',
    webAppId: `KP.${Math.ceil(Math.random() * Math.pow(10, 10))}.${Date.now()}`, // 'KP.1234567890.1630399812880',
  };

  const { data } = await $axios.post(`${baseUrl}/${id}/media-resources`, payload);
  return data.data.media as Media;
};

export { getContent, getEpisodes, getMediaResources };
