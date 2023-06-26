export interface Content {
  id: number;
  seoId: string;
  title: string;
  webtoonType: string;
  backgroundImage: URL;
  // '#300d35'
  backgroundColor: string;
  featuredCharacterAnimation: URL;
  featuredCharacterAnimationFirstFrame: URL;
  featuredCharacterAnimationLastFrame: URL;
  featuredCharacterImageA: URL;
  featuredCharacterImageB: URL;
  titleImageB: URL;
  thumbnailImage: URL;
  sharingThumbnailImage: URL;
  synopsis: string;
  authors: Author[];
  adult: boolean;
  status: string;
  genre: string;
  statistics: { viewCount: number; likeCount: number };
}

export interface Author {
  name: string;
  type: 'AUTHOR' | 'ILLUSTRATOR' | 'PUBLISHER';
  order: number;
}
