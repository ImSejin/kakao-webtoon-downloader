'use strict';

const axios = require('axios');
const {Media} = require('../model/media');
const {Episode} = require('../model/episode');
const {axiosConfig} = require('../config/axios-config');

const $axios = axios.create(axiosConfig);

/**
 * Returns episodes.
 *
 * @param contentId
 * @param offset
 * @param limit
 * @returns {Promise<[Episode]>}
 */
exports.getEpisodes = async ({contentId, offset = 0, limit = 30}) => {
  if (contentId <= 0) throw new Error(`contentId must be greater than 0, but it is '${contentId}'`);
  if (offset < 0) throw new Error(`offset must be zero or positive, but it is '${offset}'`);
  if (limit <= 0) throw new Error(`limit must be greater than 0, but it is '${limit}'`);

  // https://gateway-kw.kakao.com/episode/v1/views/content-home/contents/1299/episodes?sort=-NO&offset=0&limit=30
  const baseURL = 'https://gateway-kw.kakao.com/episode/v1/views/content-home/contents';

  const params = {
    sort: 'NO', // or '-NO'
    offset,
    limit,
  };

  const {data} = await $axios.get(`${baseURL}/${contentId}/episodes`, {params});
  return data.data.episodes.map(it => new Episode(it));
};

/**
 * Returns media resources of the content.
 *
 * @param id episode number
 * @returns {Promise<exports.Media>}
 */
exports.getMediaResources = async (id) => {
  if (id <= 0) throw new Error(`id must be greater than 0, but it is '${id}'`);

  // https://gateway-kw.kakao.com/episode/v1/views/viewer/episodes/109133/media-resources
  const baseURL = 'https://gateway-kw.kakao.com/episode/v1/views/viewer/episodes';

  const payload = {
    download: false,
    id,
    nonce: Math.random().toString(36).substring(2), // Cryptographic nonce: 'nl49iwoba1h'
    timestamp: String(Date.now()), // '1630399812880'
    type: 'AES_CBC_WEBP',
    webAppId: `KP.${Math.ceil(Math.random() * Math.pow(10, 10))}.${Date.now()}`, // 'KP.1234567890.1630399812880',
  };

  const {data} = await $axios.post(`${baseURL}/${id}/media-resources`, payload);
  return new Media(data.data.media);
};
