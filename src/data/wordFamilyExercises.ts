// Word Family exercises — 10 families
// Used by WordFamilyGame

export interface WordFamily {
  id: string;
  rime: string;
  rimeTr: string;
  onsets: string[];
  validWords: string[];
  invalidOnsets: string[];
  example: string;
}

export const WORD_FAMILIES: WordFamily[] = [
  {
    id: 'wf-at',
    rime: '-at',
    rimeTr: '-at ile biten kelimeler',
    onsets: ['c', 'b', 'h', 'r', 's', 'm', 'f', 'p', 'j'],
    validWords: ['cat', 'bat', 'hat', 'rat', 'sat', 'mat', 'fat', 'pat'],
    invalidOnsets: ['j'],
    example: 'cat',
  },
  {
    id: 'wf-og',
    rime: '-og',
    rimeTr: '-og ile biten kelimeler',
    onsets: ['d', 'l', 'f', 'b', 'h', 'j'],
    validWords: ['dog', 'log', 'fog', 'bog', 'hog', 'jog'],
    invalidOnsets: [],
    example: 'dog',
  },
  {
    id: 'wf-in',
    rime: '-in',
    rimeTr: '-in ile biten kelimeler',
    onsets: ['p', 't', 'w', 'b', 'f', 's', 'z'],
    validWords: ['pin', 'tin', 'win', 'bin', 'fin', 'sin'],
    invalidOnsets: ['z'],
    example: 'pin',
  },
  {
    id: 'wf-an',
    rime: '-an',
    rimeTr: '-an ile biten kelimeler',
    onsets: ['c', 'f', 'm', 'p', 'r', 't', 'v', 'j'],
    validWords: ['can', 'fan', 'man', 'pan', 'ran', 'tan', 'van'],
    invalidOnsets: ['j'],
    example: 'can',
  },
  {
    id: 'wf-ot',
    rime: '-ot',
    rimeTr: '-ot ile biten kelimeler',
    onsets: ['h', 'p', 'd', 'g', 'l', 'n', 'b'],
    validWords: ['hot', 'pot', 'dot', 'got', 'lot', 'not'],
    invalidOnsets: ['b'],
    example: 'hot',
  },
  {
    id: 'wf-ig',
    rime: '-ig',
    rimeTr: '-ig ile biten kelimeler',
    onsets: ['b', 'd', 'f', 'j', 'p', 'w', 'k'],
    validWords: ['big', 'dig', 'fig', 'jig', 'pig', 'wig'],
    invalidOnsets: ['k'],
    example: 'big',
  },
  {
    id: 'wf-op',
    rime: '-op',
    rimeTr: '-op ile biten kelimeler',
    onsets: ['h', 'm', 'p', 't', 'c', 'b'],
    validWords: ['hop', 'mop', 'pop', 'top', 'cop', 'bop'],
    invalidOnsets: [],
    example: 'hop',
  },
  {
    id: 'wf-ug',
    rime: '-ug',
    rimeTr: '-ug ile biten kelimeler',
    onsets: ['b', 'h', 'j', 'm', 'r', 't', 'f'],
    validWords: ['bug', 'hug', 'jug', 'mug', 'rug', 'tug'],
    invalidOnsets: ['f'],
    example: 'bug',
  },
  {
    id: 'wf-ell',
    rime: '-ell',
    rimeTr: '-ell ile biten kelimeler',
    onsets: ['b', 'f', 's', 't', 'w', 'y', 'j'],
    validWords: ['bell', 'fell', 'sell', 'tell', 'well', 'yell'],
    invalidOnsets: ['j'],
    example: 'bell',
  },
  {
    id: 'wf-ack',
    rime: '-ack',
    rimeTr: '-ack ile biten kelimeler',
    onsets: ['b', 'h', 'j', 'l', 'p', 'r', 's', 't', 'f'],
    validWords: ['back', 'hack', 'jack', 'lack', 'pack', 'rack', 'sack', 'tack'],
    invalidOnsets: ['f'],
    example: 'back',
  },
];
