import type { KanaCharacter } from "./types";

const rows = [
  ["あいうえお", "アイウエオ", ["a", "i", "u", "e", "o"], "vowel"],
  ["かきくけこ", "カキクケコ", ["ka", "ki", "ku", "ke", "ko"], "k"],
  ["さしすせそ", "サシスセソ", ["sa", "shi", "su", "se", "so"], "s"],
  ["たちつてと", "タチツテト", ["ta", "chi", "tsu", "te", "to"], "t"],
  ["なにぬねの", "ナニヌネノ", ["na", "ni", "nu", "ne", "no"], "n"],
  ["はひふへほ", "ハヒフヘホ", ["ha", "hi", "fu", "he", "ho"], "h"],
  ["まみむめも", "マミムメモ", ["ma", "mi", "mu", "me", "mo"], "m"],
  ["やゆよ", "ヤユヨ", ["ya", "yu", "yo"], "y"],
  ["らりるれろ", "ラリルレロ", ["ra", "ri", "ru", "re", "ro"], "r"],
  ["わを", "ワヲ", ["wa", "wo"], "w"],
  ["ん", "ン", ["n"], "n-final"],
] as const;

function buildKana(script: KanaCharacter["script"]): KanaCharacter[] {
  const result: KanaCharacter[] = [];
  let sortOrder = 1;

  for (const [hiragana, katakana, romaji, rowName] of rows) {
    const characters = Array.from(script === "hiragana" ? hiragana : katakana);

    characters.forEach((character, index) => {
      const value = romaji[index];
      const vowel = value === "n" ? null : (value.at(-1) as KanaCharacter["vowel"]);

      result.push({
        character,
        script,
        romaji: value,
        rowName,
        vowel,
        sortOrder: sortOrder++,
      });
    });
  }

  return result;
}

export const fallbackKana: KanaCharacter[] = [
  ...buildKana("hiragana"),
  ...buildKana("katakana"),
];
