insert into public.courses (
  id, slug, title, description, level, order_index, is_published
) values (
  '10000000-0000-0000-0000-000000000001',
  'jlpt-n5',
  'JLPT N5 · Zero to Foundation',
  'Lộ trình từ bảng chữ cái đến nền tảng JLPT N5.',
  'N5',
  1,
  true
) on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  is_published = excluded.is_published;

insert into public.units (
  id, course_id, slug, title, description, symbol, order_index, is_published
) values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'kana-foundation',
    'Nền tảng chữ Nhật',
    'Hiragana, Katakana và các quy tắc âm quan trọng.',
    'あ',
    1,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'n5-everyday',
    'N5 · Giao tiếp hằng ngày',
    'Lời chào, giới thiệu bản thân và những câu ngắn thường gặp.',
    '日',
    2,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'n5-grammar-core',
    'N5 · Ngữ pháp cốt lõi',
    'Trợ từ, câu danh từ và động từ nền tảng.',
    '文',
    3,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  symbol = excluded.symbol,
  is_published = excluded.is_published;

insert into public.lessons (
  id, unit_id, slug, title, japanese_title, description, level,
  lesson_type, estimated_minutes, item_count, order_index, content, is_published
) values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'hiragana-a-ka',
    'Hiragana: hàng あ và か',
    'あ・か行',
    'Nhận mặt và đọc 10 chữ Hiragana đầu tiên.',
    'FOUNDATION',
    'kana',
    12,
    10,
    1,
    '{"intro":"Hiragana là bảng chữ bạn sẽ gặp ở mọi nơi trong tiếng Nhật. Bài đầu tiên tập trung vào hai hàng âm để bạn nhớ theo nhóm thay vì học rời từng chữ.","learning_points":["Đọc đúng あ・い・う・え・お","Đọc đúng か・き・く・け・こ","Nhận mặt chữ trong vòng 2–3 giây"]}'::jsonb,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'hiragana-sa-ta',
    'Hiragana: hàng さ và た',
    'さ・た行',
    'Học 10 chữ tiếp theo và phân biệt các mặt chữ dễ nhầm.',
    'FOUNDATION',
    'kana',
    14,
    10,
    2,
    '{"intro":"Tiếp tục Hiragana với hàng さ và た. Chú ý さ・ち・つ vì cách đọc không hoàn toàn theo mẫu chữ La-tinh trực giác.","learning_points":["Đọc さ・し・す・せ・そ","Đọc た・ち・つ・て・と","Phân biệt các mặt chữ dễ nhầm khi nhìn nhanh"]}'::jsonb,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    'katakana-intro',
    'Bắt đầu Katakana',
    'カタカナ入門',
    'Làm quen với Katakana qua tên và từ mượn quen thuộc.',
    'FOUNDATION',
    'kana',
    15,
    12,
    3,
    '{"intro":"Katakana thường dùng cho từ mượn, tên nước ngoài và từ cần nhấn mạnh.","learning_points":["Hiểu khi nào Katakana được dùng","Nhận mặt ア・イ・ウ・エ・オ","Đọc một số từ mượn quen thuộc"]}'::jsonb,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002',
    'basic-greetings',
    'Lời chào cơ bản',
    'あいさつ',
    'Dùng đúng lời chào theo thời điểm và ngữ cảnh.',
    'N5',
    'vocabulary',
    10,
    8,
    1,
    '{"intro":"Lời chào tiếng Nhật thay đổi theo thời điểm và mức độ lịch sự. Hãy học cả tình huống dùng, không chỉ nghĩa tiếng Việt.","learning_points":["Chọn lời chào theo thời điểm","Phân biệt cách nói thân mật và lịch sự","Phản xạ với các lời chào cơ bản"]}'::jsonb,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000002',
    'self-introduction',
    'Giới thiệu bản thân',
    '自己紹介',
    'Nói tên, nghề nghiệp và nơi bạn đến bằng mẫu câu cơ bản.',
    'N5',
    'mixed',
    16,
    14,
    2,
    '{"intro":"Ghép những mảnh đầu tiên thành một lời giới thiệu ngắn: tên, nghề nghiệp, quê quán và câu kết lịch sự.","learning_points":["Dùng ～です để giới thiệu","Dùng は làm chủ đề","Nói một đoạn tự giới thiệu 3–4 câu"]}'::jsonb,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000003',
    'particles-wa-no-mo',
    'Trợ từ は・の・も',
    '助詞 は・の・も',
    'Hiểu vai trò ba trợ từ xuất hiện rất sớm trong N5.',
    'N5',
    'grammar',
    18,
    12,
    1,
    '{"intro":"Ba trợ từ は・の・も xuất hiện liên tục ở N5. Hãy nhớ vai trò của chúng trong cấu trúc câu.","learning_points":["は đánh dấu chủ đề","の nối quan hệ sở hữu hoặc bổ nghĩa","も mang nghĩa cũng trong mẫu cơ bản"]}'::jsonb,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  japanese_title = excluded.japanese_title,
  description = excluded.description,
  content = excluded.content,
  is_published = excluded.is_published;

insert into public.vocabulary (
  id, expression, reading, meaning, level, part_of_speech,
  example, example_meaning, is_published
) values
  (
    '40000000-0000-0000-0000-000000000001',
    'おはよう',
    'おはよう',
    'Chào buổi sáng',
    'N5',
    'expression',
    'おはようございます。',
    'Chào buổi sáng (lịch sự).',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'こんにちは',
    'こんにちは',
    'Xin chào / chào buổi chiều',
    'N5',
    'expression',
    'こんにちは、田中さん。',
    'Xin chào, anh/chị Tanaka.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'こんばんは',
    'こんばんは',
    'Chào buổi tối',
    'N5',
    'expression',
    'こんばんは。お元気ですか。',
    'Chào buổi tối. Bạn khỏe không?',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    'ありがとう',
    'ありがとう',
    'Cảm ơn',
    'N5',
    'expression',
    'どうもありがとうございます。',
    'Cảm ơn bạn rất nhiều.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000005',
    '私',
    'わたし',
    'Tôi',
    'N5',
    'pronoun',
    '私はフックです。',
    'Tôi là Phúc.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000006',
    '日本語',
    'にほんご',
    'Tiếng Nhật',
    'N5',
    'noun',
    '日本語を勉強します。',
    'Tôi học tiếng Nhật.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000007',
    'あか',
    'あか',
    'Màu đỏ',
    'FOUNDATION',
    'noun',
    'あかい くるま',
    'Chiếc xe màu đỏ.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000008',
    'あき',
    'あき',
    'Mùa thu',
    'FOUNDATION',
    'noun',
    'あきが すきです。',
    'Tôi thích mùa thu.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000009',
    'いけ',
    'いけ',
    'Ao',
    'FOUNDATION',
    'noun',
    'いけに さかなが います。',
    'Có cá trong ao.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000010',
    'すし',
    'すし',
    'Sushi',
    'FOUNDATION',
    'noun',
    'すしを たべます。',
    'Tôi ăn sushi.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000011',
    'つき',
    'つき',
    'Mặt trăng',
    'FOUNDATION',
    'noun',
    'つきが きれいです。',
    'Trăng đẹp.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000012',
    'そと',
    'そと',
    'Bên ngoài',
    'FOUNDATION',
    'noun',
    'そとは さむいです。',
    'Bên ngoài lạnh.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000013',
    'アイス',
    'アイス',
    'Kem',
    'FOUNDATION',
    'noun',
    'アイスを ください。',
    'Cho tôi một cây/cốc kem.',
    true
  ),
  (
    '40000000-0000-0000-0000-000000000014',
    'エアコン',
    'エアコン',
    'Máy điều hòa',
    'FOUNDATION',
    'noun',
    'エアコンを つけます。',
    'Tôi bật điều hòa.',
    true
  )
on conflict (id) do update set
  expression = excluded.expression,
  reading = excluded.reading,
  meaning = excluded.meaning,
  example = excluded.example,
  example_meaning = excluded.example_meaning,
  is_published = excluded.is_published;

insert into public.lesson_vocabulary (lesson_id, vocabulary_id, order_index)
values
  ('30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000007', 1),
  ('30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000008', 2),
  ('30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000009', 3),
  ('30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000010', 1),
  ('30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000011', 2),
  ('30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000012', 3),
  ('30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000013', 1),
  ('30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000014', 2),
  ('30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 1),
  ('30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', 2),
  ('30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000003', 3),
  ('30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 4),
  ('30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 1),
  ('30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000006', 2),
  ('30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000005', 1),
  ('30000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 2)
on conflict (lesson_id, vocabulary_id) do update set
  order_index = excluded.order_index;

-- Kana is small, stable reference data, so it is maintained locally rather than
-- imported from an external dictionary dataset.
insert into public.kana (
  character, script, romaji, row_name, vowel, category, sort_order
) values
  ('あ', 'hiragana', 'a',   'vowel', 'a', 'basic', 1),
  ('い', 'hiragana', 'i',   'vowel', 'i', 'basic', 2),
  ('う', 'hiragana', 'u',   'vowel', 'u', 'basic', 3),
  ('え', 'hiragana', 'e',   'vowel', 'e', 'basic', 4),
  ('お', 'hiragana', 'o',   'vowel', 'o', 'basic', 5),
  ('か', 'hiragana', 'ka',  'k', 'a', 'basic', 6),
  ('き', 'hiragana', 'ki',  'k', 'i', 'basic', 7),
  ('く', 'hiragana', 'ku',  'k', 'u', 'basic', 8),
  ('け', 'hiragana', 'ke',  'k', 'e', 'basic', 9),
  ('こ', 'hiragana', 'ko',  'k', 'o', 'basic', 10),
  ('さ', 'hiragana', 'sa',  's', 'a', 'basic', 11),
  ('し', 'hiragana', 'shi', 's', 'i', 'basic', 12),
  ('す', 'hiragana', 'su',  's', 'u', 'basic', 13),
  ('せ', 'hiragana', 'se',  's', 'e', 'basic', 14),
  ('そ', 'hiragana', 'so',  's', 'o', 'basic', 15),
  ('た', 'hiragana', 'ta',  't', 'a', 'basic', 16),
  ('ち', 'hiragana', 'chi', 't', 'i', 'basic', 17),
  ('つ', 'hiragana', 'tsu', 't', 'u', 'basic', 18),
  ('て', 'hiragana', 'te',  't', 'e', 'basic', 19),
  ('と', 'hiragana', 'to',  't', 'o', 'basic', 20),
  ('な', 'hiragana', 'na',  'n', 'a', 'basic', 21),
  ('に', 'hiragana', 'ni',  'n', 'i', 'basic', 22),
  ('ぬ', 'hiragana', 'nu',  'n', 'u', 'basic', 23),
  ('ね', 'hiragana', 'ne',  'n', 'e', 'basic', 24),
  ('の', 'hiragana', 'no',  'n', 'o', 'basic', 25),
  ('は', 'hiragana', 'ha',  'h', 'a', 'basic', 26),
  ('ひ', 'hiragana', 'hi',  'h', 'i', 'basic', 27),
  ('ふ', 'hiragana', 'fu',  'h', 'u', 'basic', 28),
  ('へ', 'hiragana', 'he',  'h', 'e', 'basic', 29),
  ('ほ', 'hiragana', 'ho',  'h', 'o', 'basic', 30),
  ('ま', 'hiragana', 'ma',  'm', 'a', 'basic', 31),
  ('み', 'hiragana', 'mi',  'm', 'i', 'basic', 32),
  ('む', 'hiragana', 'mu',  'm', 'u', 'basic', 33),
  ('め', 'hiragana', 'me',  'm', 'e', 'basic', 34),
  ('も', 'hiragana', 'mo',  'm', 'o', 'basic', 35),
  ('や', 'hiragana', 'ya',  'y', 'a', 'basic', 36),
  ('ゆ', 'hiragana', 'yu',  'y', 'u', 'basic', 37),
  ('よ', 'hiragana', 'yo',  'y', 'o', 'basic', 38),
  ('ら', 'hiragana', 'ra',  'r', 'a', 'basic', 39),
  ('り', 'hiragana', 'ri',  'r', 'i', 'basic', 40),
  ('る', 'hiragana', 'ru',  'r', 'u', 'basic', 41),
  ('れ', 'hiragana', 're',  'r', 'e', 'basic', 42),
  ('ろ', 'hiragana', 'ro',  'r', 'o', 'basic', 43),
  ('わ', 'hiragana', 'wa',  'w', 'a', 'basic', 44),
  ('を', 'hiragana', 'wo',  'w', 'o', 'basic', 45),
  ('ん', 'hiragana', 'n',   'n-final', null, 'basic', 46),
  ('ア', 'katakana', 'a',   'vowel', 'a', 'basic', 1),
  ('イ', 'katakana', 'i',   'vowel', 'i', 'basic', 2),
  ('ウ', 'katakana', 'u',   'vowel', 'u', 'basic', 3),
  ('エ', 'katakana', 'e',   'vowel', 'e', 'basic', 4),
  ('オ', 'katakana', 'o',   'vowel', 'o', 'basic', 5),
  ('カ', 'katakana', 'ka',  'k', 'a', 'basic', 6),
  ('キ', 'katakana', 'ki',  'k', 'i', 'basic', 7),
  ('ク', 'katakana', 'ku',  'k', 'u', 'basic', 8),
  ('ケ', 'katakana', 'ke',  'k', 'e', 'basic', 9),
  ('コ', 'katakana', 'ko',  'k', 'o', 'basic', 10),
  ('サ', 'katakana', 'sa',  's', 'a', 'basic', 11),
  ('シ', 'katakana', 'shi', 's', 'i', 'basic', 12),
  ('ス', 'katakana', 'su',  's', 'u', 'basic', 13),
  ('セ', 'katakana', 'se',  's', 'e', 'basic', 14),
  ('ソ', 'katakana', 'so',  's', 'o', 'basic', 15),
  ('タ', 'katakana', 'ta',  't', 'a', 'basic', 16),
  ('チ', 'katakana', 'chi', 't', 'i', 'basic', 17),
  ('ツ', 'katakana', 'tsu', 't', 'u', 'basic', 18),
  ('テ', 'katakana', 'te',  't', 'e', 'basic', 19),
  ('ト', 'katakana', 'to',  't', 'o', 'basic', 20),
  ('ナ', 'katakana', 'na',  'n', 'a', 'basic', 21),
  ('ニ', 'katakana', 'ni',  'n', 'i', 'basic', 22),
  ('ヌ', 'katakana', 'nu',  'n', 'u', 'basic', 23),
  ('ネ', 'katakana', 'ne',  'n', 'e', 'basic', 24),
  ('ノ', 'katakana', 'no',  'n', 'o', 'basic', 25),
  ('ハ', 'katakana', 'ha',  'h', 'a', 'basic', 26),
  ('ヒ', 'katakana', 'hi',  'h', 'i', 'basic', 27),
  ('フ', 'katakana', 'fu',  'h', 'u', 'basic', 28),
  ('ヘ', 'katakana', 'he',  'h', 'e', 'basic', 29),
  ('ホ', 'katakana', 'ho',  'h', 'o', 'basic', 30),
  ('マ', 'katakana', 'ma',  'm', 'a', 'basic', 31),
  ('ミ', 'katakana', 'mi',  'm', 'i', 'basic', 32),
  ('ム', 'katakana', 'mu',  'm', 'u', 'basic', 33),
  ('メ', 'katakana', 'me',  'm', 'e', 'basic', 34),
  ('モ', 'katakana', 'mo',  'm', 'o', 'basic', 35),
  ('ヤ', 'katakana', 'ya',  'y', 'a', 'basic', 36),
  ('ユ', 'katakana', 'yu',  'y', 'u', 'basic', 37),
  ('ヨ', 'katakana', 'yo',  'y', 'o', 'basic', 38),
  ('ラ', 'katakana', 'ra',  'r', 'a', 'basic', 39),
  ('リ', 'katakana', 'ri',  'r', 'i', 'basic', 40),
  ('ル', 'katakana', 'ru',  'r', 'u', 'basic', 41),
  ('レ', 'katakana', 're',  'r', 'e', 'basic', 42),
  ('ロ', 'katakana', 'ro',  'r', 'o', 'basic', 43),
  ('ワ', 'katakana', 'wa',  'w', 'a', 'basic', 44),
  ('ヲ', 'katakana', 'wo',  'w', 'o', 'basic', 45),
  ('ン', 'katakana', 'n',   'n-final', null, 'basic', 46)
on conflict (script, character) do update set
  romaji = excluded.romaji,
  row_name = excluded.row_name,
  vowel = excluded.vowel,
  category = excluded.category,
  sort_order = excluded.sort_order;

insert into public.kana (
  character, script, romaji, row_name, vowel, category, sort_order
) values
  ('が','hiragana','ga','g','a','dakuten',101),('ぎ','hiragana','gi','g','i','dakuten',102),('ぐ','hiragana','gu','g','u','dakuten',103),('げ','hiragana','ge','g','e','dakuten',104),('ご','hiragana','go','g','o','dakuten',105),
  ('ざ','hiragana','za','z','a','dakuten',106),('じ','hiragana','ji','z','i','dakuten',107),('ず','hiragana','zu','z','u','dakuten',108),('ぜ','hiragana','ze','z','e','dakuten',109),('ぞ','hiragana','zo','z','o','dakuten',110),
  ('だ','hiragana','da','d','a','dakuten',111),('ぢ','hiragana','ji','d','i','dakuten',112),('づ','hiragana','zu','d','u','dakuten',113),('で','hiragana','de','d','e','dakuten',114),('ど','hiragana','do','d','o','dakuten',115),
  ('ば','hiragana','ba','b','a','dakuten',116),('び','hiragana','bi','b','i','dakuten',117),('ぶ','hiragana','bu','b','u','dakuten',118),('べ','hiragana','be','b','e','dakuten',119),('ぼ','hiragana','bo','b','o','dakuten',120),
  ('ぱ','hiragana','pa','p','a','handakuten',121),('ぴ','hiragana','pi','p','i','handakuten',122),('ぷ','hiragana','pu','p','u','handakuten',123),('ぺ','hiragana','pe','p','e','handakuten',124),('ぽ','hiragana','po','p','o','handakuten',125),
  ('っ','hiragana','small-tsu','small',null,'small',126),
  ('ガ','katakana','ga','g','a','dakuten',101),('ギ','katakana','gi','g','i','dakuten',102),('グ','katakana','gu','g','u','dakuten',103),('ゲ','katakana','ge','g','e','dakuten',104),('ゴ','katakana','go','g','o','dakuten',105),
  ('ザ','katakana','za','z','a','dakuten',106),('ジ','katakana','ji','z','i','dakuten',107),('ズ','katakana','zu','z','u','dakuten',108),('ゼ','katakana','ze','z','e','dakuten',109),('ゾ','katakana','zo','z','o','dakuten',110),
  ('ダ','katakana','da','d','a','dakuten',111),('ヂ','katakana','ji','d','i','dakuten',112),('ヅ','katakana','zu','d','u','dakuten',113),('デ','katakana','de','d','e','dakuten',114),('ド','katakana','do','d','o','dakuten',115),
  ('バ','katakana','ba','b','a','dakuten',116),('ビ','katakana','bi','b','i','dakuten',117),('ブ','katakana','bu','b','u','dakuten',118),('ベ','katakana','be','b','e','dakuten',119),('ボ','katakana','bo','b','o','dakuten',120),
  ('パ','katakana','pa','p','a','handakuten',121),('ピ','katakana','pi','p','i','handakuten',122),('プ','katakana','pu','p','u','handakuten',123),('ペ','katakana','pe','p','e','handakuten',124),('ポ','katakana','po','p','o','handakuten',125),
  ('ッ','katakana','small-tsu','small',null,'small',126),('ー','katakana','long-vowel','long',null,'other',127)
on conflict (script, character) do update set
  romaji = excluded.romaji,
  row_name = excluded.row_name,
  vowel = excluded.vowel,
  category = excluded.category,
  sort_order = excluded.sort_order;

-- Populate the normalized JMdict-compatible tables from the hand-authored
-- vocabulary that already powers the prototype.
insert into public.vocabulary_readings (
  vocabulary_id, reading, is_primary, no_kanji
)
select
  id,
  reading,
  true,
  expression = reading
from public.vocabulary
on conflict (vocabulary_id, reading) do update set
  is_primary = excluded.is_primary,
  no_kanji = excluded.no_kanji;

insert into public.vocabulary_senses (
  vocabulary_id, sense_index, parts_of_speech
)
select
  id,
  1,
  case
    when part_of_speech is null then '{}'::text[]
    else array[part_of_speech]
  end
from public.vocabulary
on conflict (vocabulary_id, sense_index) do update set
  parts_of_speech = excluded.parts_of_speech;

insert into public.vocabulary_glosses (
  sense_id, language, gloss, order_index
)
select
  s.id,
  'vi',
  v.meaning,
  0
from public.vocabulary v
join public.vocabulary_senses s
  on s.vocabulary_id = v.id
 and s.sense_index = 1
on conflict (sense_id, language, gloss) do nothing;

insert into public.vocabulary_jlpt (
  vocabulary_id, level_code, source
)
select
  id,
  level,
  'prototype_seed'
from public.vocabulary
where level in ('N5', 'N4', 'N3', 'N2', 'N1')
on conflict (vocabulary_id, level_code, source) do nothing;

insert into public.examples (japanese_text, source)
select distinct
  example,
  'prototype_seed'
from public.vocabulary
where nullif(btrim(example), '') is not null
on conflict (source, japanese_text) do nothing;

insert into public.example_translations (
  example_id, language, translated_text
)
select
  e.id,
  'vi',
  v.example_meaning
from public.vocabulary v
join public.examples e
  on e.source = 'prototype_seed'
 and e.japanese_text = v.example
where nullif(btrim(v.example_meaning), '') is not null
on conflict (example_id, language, translated_text) do nothing;

insert into public.vocabulary_examples (
  vocabulary_id, example_id, source
)
select
  v.id,
  e.id,
  'prototype_seed'
from public.vocabulary v
join public.examples e
  on e.source = 'prototype_seed'
 and e.japanese_text = v.example
on conflict (vocabulary_id, example_id) do update set
  source = excluded.source;
