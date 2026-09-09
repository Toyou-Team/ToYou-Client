import { StaticImageData } from 'next/image';

export interface LetterSong {
  title: string;
  artist: string;
  albumImage: string | StaticImageData;
}
