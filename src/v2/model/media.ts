export interface Media {
  aid: string;
  codec: string;
  container: 'WEBP' | 'JPEG';
  files: MediaFile[];
  totalSize: number;
  zid: string;
}

export interface MediaFile {
  width: number;
  height: number;
  url: URL;
}
