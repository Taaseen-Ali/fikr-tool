// src/utils/rootSlug.js
// Converts Arabic root string like 'ب ر ك' to URL slug 'b-r-k'

const ARABIC_TO_ROMAN = {
  'ء': 'hamza', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
  'ب': 'b',  'ت': 't',  'ث': 'th',
  'ج': 'j',  'ح': 'h',  'خ': 'kh',
  'د': 'd',  'ذ': 'dh', 'ر': 'r',  'ز': 'z',
  'س': 's',  'ش': 'sh', 'ص': 'S',  'ض': 'D',
  'ط': 'T',  'ظ': 'Z',  'ع': 'gh', 'غ': 'gh2',
  'ف': 'f',  'ق': 'q',  'ك': 'k',  'ل': 'l',
  'م': 'm',  'ن': 'n',  'ه': 'h2', 'و': 'w',  'ي': 'y',
  'ا': 'aa2','ى': 'aa3',
};

const HARAKAT_RE = /[\u064B-\u0652\u0670\u06D6-\u06ED]/g;

export function rootToSlug(root) {
  if (!root) return '';
  const letters = root.trim().split(/\s+/);
  return letters
    .map(l => ARABIC_TO_ROMAN[l.replace(HARAKAT_RE, '')] || l)
    .join('-');
}
