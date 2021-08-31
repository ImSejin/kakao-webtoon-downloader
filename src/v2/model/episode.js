'use strict';

exports.Episode = class Episode {
  constructor({
                id, seoId, contentId, no, seasonNo, seasonEpisodeNo,
                title, status, ageLimit, adult, serialStartDateTime,
                asset, viewerAsset, useType, useStartDateTime, readable, read,
              }) {
    this.id = id;
    this.seoId = seoId;
    this.contentId = contentId;
    this.no = no;
    this.seasonNo = seasonNo;
    this.seasonEpisodeNo = seasonEpisodeNo;
    this.title = title;
    this.status = status;
    this.ageLimit = ageLimit;
    this.adult = adult;
    this.serialStartDateTime = serialStartDateTime;
    this.asset = asset;
    this.viewerAsset = viewerAsset;
    this.useType = useType;
    this.useStartDateTime = useStartDateTime;
    this.readable = readable;
    this.read = read;
  }
}
