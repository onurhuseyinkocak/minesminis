export interface PhonicsSound {
  id: string;
  grapheme: string;
  example: string;
  emoji: string;
  action: string;
  turkishNote: string;
  keywords: { word: string; emoji: string }[];
  group: number;
}

export interface TPRCommand {
  command: string;
  emoji: string;
}
