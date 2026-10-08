insert into public.kana (
  character, script, romaji, row_name, vowel, category, sort_order
) values
  ('が', 'hiragana', 'ga',  'g', 'a', 'dakuten', 101),
  ('ぎ', 'hiragana', 'gi',  'g', 'i', 'dakuten', 102),
  ('ぐ', 'hiragana', 'gu',  'g', 'u', 'dakuten', 103),
  ('げ', 'hiragana', 'ge',  'g', 'e', 'dakuten', 104),
  ('ご', 'hiragana', 'go',  'g', 'o', 'dakuten', 105),
  ('ざ', 'hiragana', 'za',  'z', 'a', 'dakuten', 106),
  ('じ', 'hiragana', 'ji',  'z', 'i', 'dakuten', 107),
  ('ず', 'hiragana', 'zu',  'z', 'u', 'dakuten', 108),
  ('ぜ', 'hiragana', 'ze',  'z', 'e', 'dakuten', 109),
  ('ぞ', 'hiragana', 'zo',  'z', 'o', 'dakuten', 110),
  ('だ', 'hiragana', 'da',  'd', 'a', 'dakuten', 111),
  ('ぢ', 'hiragana', 'ji',  'd', 'i', 'dakuten', 112),
  ('づ', 'hiragana', 'zu',  'd', 'u', 'dakuten', 113),
  ('で', 'hiragana', 'de',  'd', 'e', 'dakuten', 114),
  ('ど', 'hiragana', 'do',  'd', 'o', 'dakuten', 115),
  ('ば', 'hiragana', 'ba',  'b', 'a', 'dakuten', 116),
  ('び', 'hiragana', 'bi',  'b', 'i', 'dakuten', 117),
  ('ぶ', 'hiragana', 'bu',  'b', 'u', 'dakuten', 118),
  ('べ', 'hiragana', 'be',  'b', 'e', 'dakuten', 119),
  ('ぼ', 'hiragana', 'bo',  'b', 'o', 'dakuten', 120),
  ('ぱ', 'hiragana', 'pa',  'p', 'a', 'handakuten', 121),
  ('ぴ', 'hiragana', 'pi',  'p', 'i', 'handakuten', 122),
  ('ぷ', 'hiragana', 'pu',  'p', 'u', 'handakuten', 123),
  ('ぺ', 'hiragana', 'pe',  'p', 'e', 'handakuten', 124),
  ('ぽ', 'hiragana', 'po',  'p', 'o', 'handakuten', 125),
  ('っ', 'hiragana', 'small-tsu', 'small', null, 'small', 126),
  ('ガ', 'katakana', 'ga',  'g', 'a', 'dakuten', 101),
  ('ギ', 'katakana', 'gi',  'g', 'i', 'dakuten', 102),
  ('グ', 'katakana', 'gu',  'g', 'u', 'dakuten', 103),
  ('ゲ', 'katakana', 'ge',  'g', 'e', 'dakuten', 104),
  ('ゴ', 'katakana', 'go',  'g', 'o', 'dakuten', 105),
  ('ザ', 'katakana', 'za',  'z', 'a', 'dakuten', 106),
  ('ジ', 'katakana', 'ji',  'z', 'i', 'dakuten', 107),
  ('ズ', 'katakana', 'zu',  'z', 'u', 'dakuten', 108),
  ('ゼ', 'katakana', 'ze',  'z', 'e', 'dakuten', 109),
  ('ゾ', 'katakana', 'zo',  'z', 'o', 'dakuten', 110),
  ('ダ', 'katakana', 'da',  'd', 'a', 'dakuten', 111),
  ('ヂ', 'katakana', 'ji',  'd', 'i', 'dakuten', 112),
  ('ヅ', 'katakana', 'zu',  'd', 'u', 'dakuten', 113),
  ('デ', 'katakana', 'de',  'd', 'e', 'dakuten', 114),
  ('ド', 'katakana', 'do',  'd', 'o', 'dakuten', 115),
  ('バ', 'katakana', 'ba',  'b', 'a', 'dakuten', 116),
  ('ビ', 'katakana', 'bi',  'b', 'i', 'dakuten', 117),
  ('ブ', 'katakana', 'bu',  'b', 'u', 'dakuten', 118),
  ('ベ', 'katakana', 'be',  'b', 'e', 'dakuten', 119),
  ('ボ', 'katakana', 'bo',  'b', 'o', 'dakuten', 120),
  ('パ', 'katakana', 'pa',  'p', 'a', 'handakuten', 121),
  ('ピ', 'katakana', 'pi',  'p', 'i', 'handakuten', 122),
  ('プ', 'katakana', 'pu',  'p', 'u', 'handakuten', 123),
  ('ペ', 'katakana', 'pe',  'p', 'e', 'handakuten', 124),
  ('ポ', 'katakana', 'po',  'p', 'o', 'handakuten', 125),
  ('ッ', 'katakana', 'small-tsu', 'small', null, 'small', 126),
  ('ー', 'katakana', 'long-vowel', 'long', null, 'other', 127)
on conflict (script, character) do update set
  romaji = excluded.romaji,
  row_name = excluded.row_name,
  vowel = excluded.vowel,
  category = excluded.category,
  sort_order = excluded.sort_order;

update public.kana derived
set base_kana_id = base.id
from public.kana base
where derived.script = base.script
  and base.category = 'basic'
  and (
    (derived.character, base.character) in (
      ('が','か'),('ぎ','き'),('ぐ','く'),('げ','け'),('ご','こ'),
      ('ざ','さ'),('じ','し'),('ず','す'),('ぜ','せ'),('ぞ','そ'),
      ('だ','た'),('ぢ','ち'),('づ','つ'),('で','て'),('ど','と'),
      ('ば','は'),('び','ひ'),('ぶ','ふ'),('べ','へ'),('ぼ','ほ'),
      ('ぱ','は'),('ぴ','ひ'),('ぷ','ふ'),('ぺ','へ'),('ぽ','ほ'),
      ('ガ','カ'),('ギ','キ'),('グ','ク'),('ゲ','ケ'),('ゴ','コ'),
      ('ザ','サ'),('ジ','シ'),('ズ','ス'),('ゼ','セ'),('ゾ','ソ'),
      ('ダ','タ'),('ヂ','チ'),('ヅ','ツ'),('デ','テ'),('ド','ト'),
      ('バ','ハ'),('ビ','ヒ'),('ブ','フ'),('ベ','ヘ'),('ボ','ホ'),
      ('パ','ハ'),('ピ','ヒ'),('プ','フ'),('ペ','ヘ'),('ポ','ホ')
    )
  );
