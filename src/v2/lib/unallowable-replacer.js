'use strict';

exports.replaceUnallowables = (filename) => {
  return filename.replace(/\\/g, '＼')
      .replace(/\//g, '／')
      .replace(/:/g, '：')
      .replace(/\*/g, '＊')
      .replace(/\?/g, '？')
      .replace(/"/g, '＂')
      .replace(/</g, '＜')
      .replace(/>/g, '＞')
      .replace(/\|/g, '｜')
      .replace(/\.{2,}$/, '…')
      .replace(/\.$/, '．');
};
