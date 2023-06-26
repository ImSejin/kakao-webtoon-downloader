export interface Episode {
  id: number;
  seoId: string;
  contentId: number;
  no: string;
  seasonNo: string;
  seasonEpisodeNo: number;
  title: string;
  status: string;
  ageLimit: number;
  adult: boolean;
  serialStartDateTime: Date;
  responseDateTime: Date;
  asset: object;
  viewerAsset: object;
  useType: string;
  useStartDateTime: Date;
  readable: boolean;
  read: boolean;
}
