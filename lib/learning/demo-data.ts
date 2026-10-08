import type { LessonDetail, UnitSummary, VocabularyCard } from "./types";

export const demoUnits: UnitSummary[] = [
  {
    slug: "kana-foundation",
    title: "Nền tảng chữ Nhật",
    description: "Hiragana, Katakana và các quy tắc âm quan trọng.",
    symbol: "あ",
    progress: 42,
    lessons: [
      {
        slug: "hiragana-a-ka",
        title: "Hiragana: hàng あ và か",
        japaneseTitle: "あ・か行",
        description: "Nhận mặt và đọc 10 chữ Hiragana đầu tiên.",
        level: "Nhập môn",
        estimatedMinutes: 12,
        itemCount: 10,
        status: "completed",
        progress: 100,
      },
      {
        slug: "hiragana-sa-ta",
        title: "Hiragana: hàng さ và た",
        japaneseTitle: "さ・た行",
        description: "Học 10 chữ tiếp theo và phân biệt các mặt chữ dễ nhầm.",
        level: "Nhập môn",
        estimatedMinutes: 14,
        itemCount: 10,
        status: "in_progress",
        progress: 45,
      },
      {
        slug: "katakana-intro",
        title: "Bắt đầu Katakana",
        japaneseTitle: "カタカナ入門",
        description: "Làm quen với Katakana qua tên và từ mượn quen thuộc.",
        level: "Nhập môn",
        estimatedMinutes: 15,
        itemCount: 12,
        status: "ready",
        progress: 0,
      },
    ],
  },
  {
    slug: "n5-everyday",
    title: "N5 · Giao tiếp hằng ngày",
    description: "Lời chào, giới thiệu bản thân và những câu ngắn thường gặp.",
    symbol: "日",
    progress: 12,
    lessons: [
      {
        slug: "basic-greetings",
        title: "Lời chào cơ bản",
        japaneseTitle: "あいさつ",
        description: "Dùng đúng lời chào theo thời điểm và ngữ cảnh.",
        level: "N5",
        estimatedMinutes: 10,
        itemCount: 8,
        status: "ready",
        progress: 0,
      },
      {
        slug: "self-introduction",
        title: "Giới thiệu bản thân",
        japaneseTitle: "自己紹介",
        description: "Nói tên, nghề nghiệp và nơi bạn đến bằng mẫu câu cơ bản.",
        level: "N5",
        estimatedMinutes: 16,
        itemCount: 14,
        status: "locked",
        progress: 0,
      },
    ],
  },
  {
    slug: "n5-grammar-core",
    title: "N5 · Ngữ pháp cốt lõi",
    description: "Trợ từ, câu danh từ và động từ nền tảng.",
    symbol: "文",
    progress: 0,
    lessons: [
      {
        slug: "particles-wa-no-mo",
        title: "Trợ từ は・の・も",
        japaneseTitle: "助詞 は・の・も",
        description: "Hiểu vai trò ba trợ từ xuất hiện rất sớm trong N5.",
        level: "N5",
        estimatedMinutes: 18,
        itemCount: 12,
        status: "locked",
        progress: 0,
      },
    ],
  },
];

export const demoVocabulary: VocabularyCard[] = [
  {
    id: "v-ohayou",
    expression: "おはよう",
    reading: "おはよう",
    meaning: "Chào buổi sáng",
    example: "おはようございます。",
    exampleMeaning: "Chào buổi sáng (lịch sự).",
  },
  {
    id: "v-konnichiwa",
    expression: "こんにちは",
    reading: "こんにちは",
    meaning: "Xin chào / chào buổi chiều",
    example: "こんにちは、田中さん。",
    exampleMeaning: "Xin chào, anh/chị Tanaka.",
  },
  {
    id: "v-konbanwa",
    expression: "こんばんは",
    reading: "こんばんは",
    meaning: "Chào buổi tối",
    example: "こんばんは。お元気ですか。",
    exampleMeaning: "Chào buổi tối. Bạn khỏe không?",
  },
  {
    id: "v-arigatou",
    expression: "ありがとう",
    reading: "ありがとう",
    meaning: "Cảm ơn",
    example: "どうもありがとうございます。",
    exampleMeaning: "Cảm ơn bạn rất nhiều.",
  },
  {
    id: "v-watashi",
    expression: "私",
    reading: "わたし",
    meaning: "Tôi",
    example: "私はフックです。",
    exampleMeaning: "Tôi là Phúc.",
  },
  {
    id: "v-nihongo",
    expression: "日本語",
    reading: "にほんご",
    meaning: "Tiếng Nhật",
    example: "日本語を勉強します。",
    exampleMeaning: "Tôi học tiếng Nhật.",
  },
];

export const demoLessons: Record<string, LessonDetail> = {
  "hiragana-a-ka": {
    ...demoUnits[0].lessons[0],
    intro:
      "Hiragana là bảng chữ bạn sẽ gặp ở mọi nơi trong tiếng Nhật. Bài đầu tiên tập trung vào hai hàng âm để bạn nhớ theo nhóm thay vì học rời từng chữ.",
    learningPoints: [
      "Đọc đúng あ・い・う・え・お",
      "Đọc đúng か・き・く・け・こ",
      "Nhận mặt chữ trong vòng 2–3 giây",
    ],
    vocabulary: [
      {
        id: "k-aka",
        expression: "あか",
        reading: "aka",
        meaning: "màu đỏ",
        example: "あかい くるま",
        exampleMeaning: "chiếc xe màu đỏ",
      },
      {
        id: "k-aki",
        expression: "あき",
        reading: "aki",
        meaning: "mùa thu",
        example: "あきが すきです。",
        exampleMeaning: "Tôi thích mùa thu.",
      },
      {
        id: "k-ike",
        expression: "いけ",
        reading: "ike",
        meaning: "ao",
        example: "いけに さかなが います。",
        exampleMeaning: "Có cá trong ao.",
      },
    ],
  },
  "hiragana-sa-ta": {
    ...demoUnits[0].lessons[1],
    intro:
      "Tiếp tục Hiragana với hàng さ và た. Chú ý さ・ち・つ vì cách đọc không hoàn toàn theo mẫu chữ La-tinh trực giác.",
    learningPoints: [
      "Đọc さ・し・す・せ・そ",
      "Đọc た・ち・つ・て・と",
      "Phân biệt さ với き và ち với ら khi nhìn nhanh",
    ],
    vocabulary: [
      {
        id: "s-sushi",
        expression: "すし",
        reading: "sushi",
        meaning: "sushi",
        example: "すしを たべます。",
        exampleMeaning: "Tôi ăn sushi.",
      },
      {
        id: "s-tsuki",
        expression: "つき",
        reading: "tsuki",
        meaning: "mặt trăng",
        example: "つきが きれいです。",
        exampleMeaning: "Trăng đẹp.",
      },
      {
        id: "s-soto",
        expression: "そと",
        reading: "soto",
        meaning: "bên ngoài",
        example: "そとは さむいです。",
        exampleMeaning: "Bên ngoài lạnh.",
      },
    ],
  },
  "katakana-intro": {
    ...demoUnits[0].lessons[2],
    intro:
      "Katakana thường dùng cho từ mượn, tên nước ngoài và từ cần nhấn mạnh. Học nó sau Hiragana giúp bạn đọc menu và tên sản phẩm nhanh hơn.",
    learningPoints: [
      "Hiểu khi nào Katakana được dùng",
      "Nhận mặt ア・イ・ウ・エ・オ",
      "Đọc một số từ mượn quen thuộc",
    ],
    vocabulary: [
      {
        id: "ka-ai",
        expression: "アイス",
        reading: "aisu",
        meaning: "kem",
        example: "アイスを ください。",
        exampleMeaning: "Cho tôi một cây/cốc kem.",
      },
      {
        id: "ka-eki",
        expression: "エアコン",
        reading: "eakon",
        meaning: "máy điều hòa",
        example: "エアコンを つけます。",
        exampleMeaning: "Tôi bật điều hòa.",
      },
    ],
  },
  "basic-greetings": {
    ...demoUnits[1].lessons[0],
    intro:
      "Lời chào tiếng Nhật thay đổi theo thời điểm và mức độ lịch sự. Hãy học cả tình huống dùng, không chỉ nghĩa tiếng Việt.",
    learningPoints: [
      "Chọn lời chào theo thời điểm",
      "Phân biệt cách nói thân mật và lịch sự",
      "Phản xạ với các lời chào cơ bản",
    ],
    vocabulary: demoVocabulary.slice(0, 4),
  },
  "self-introduction": {
    ...demoUnits[1].lessons[1],
    intro:
      "Bài này ghép các mảnh đầu tiên thành một lời giới thiệu ngắn: tên, nghề nghiệp, quê quán và câu kết lịch sự.",
    learningPoints: [
      "Dùng ～です để giới thiệu",
      "Dùng は làm chủ đề",
      "Nói một đoạn tự giới thiệu 3–4 câu",
    ],
    vocabulary: demoVocabulary.slice(4),
  },
  "particles-wa-no-mo": {
    ...demoUnits[2].lessons[0],
    intro:
      "Ba trợ từ は・の・も xuất hiện liên tục ở N5. Thay vì dịch từng chữ, hãy nhớ vai trò của chúng trong cấu trúc câu.",
    learningPoints: [
      "は đánh dấu chủ đề",
      "の nối quan hệ sở hữu / bổ nghĩa",
      "も mang nghĩa ‘cũng’ trong mẫu cơ bản",
    ],
    vocabulary: demoVocabulary.slice(4),
  },
};
