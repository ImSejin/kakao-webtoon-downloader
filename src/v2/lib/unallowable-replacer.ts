const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/\\/g, '＼')
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

export { sanitizeFileName };
