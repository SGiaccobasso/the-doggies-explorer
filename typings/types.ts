export interface TokenData {
  name: string;
  description: string;
  thumbnail: string;
  traits: Array<{ trait_type: string; value: string }>;
}
