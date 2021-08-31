'use strict';

exports.Media = class Media {
  constructor({aid, codec, container, files, totalSize, zid}) {
    this.aid = aid;
    this.codec = codec;
    this.container = container;
    this.files = files.map(it => new MediaFile(it));
    this.totalSize = totalSize;
    this.zid = zid;
  }
};

class MediaFile {
  constructor({width, height, url}) {
    this.width = width;
    this.height = height;
    this.url = url;
  }
}
