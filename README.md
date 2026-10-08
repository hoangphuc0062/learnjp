# Manabu

Web tự học tiếng Nhật bằng Next.js + Supabase, ưu tiên mobile và lộ trình từ nhập môn đến JLPT.

Hiện bản đầu tập trung vào:

- Trang **Hôm nay**: bài tiếp theo, mục tiêu ngày, số thẻ đến hạn.
- **Lộ trình N5**: chia theo chặng và bài.
- **Bài học**: chữ Nhật, nghĩa, ví dụ và mục tiêu bài.
- **Ôn tập SRS**: lật thẻ và đánh giá Quên / Khó / Nhớ.
- **Tiến độ**: streak, thời gian học, bài hoàn thành.
- **Supabase Auth**: đăng ký/đăng nhập bằng email + mật khẩu.
- **Supabase Postgres + RLS**: nội dung dùng chung, tiến độ tách theo từng tài khoản.

Nếu chưa cấu hình Supabase, app tự chạy bằng dữ liệu demo để bạn vẫn phát triển UI và deploy preview.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth + Postgres
- Vercel

## Chạy web local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

Nếu chưa có Supabase project, có thể bỏ trống hai biến môi trường để dùng demo mode.

## Chạy Supabase local

Docker cần đang chạy.

```bash
npx supabase@2.120.0 start
npx supabase@2.120.0 db reset --local
```

Lệnh reset sẽ:

1. Chạy migration trong `supabase/migrations/`.
2. Chạy `supabase/seed.sql`.
3. Tạo dữ liệu mẫu N5.

Kiểm tra database:

```bash
npx supabase@2.120.0 db advisors --local
npx supabase@2.120.0 status
```

## Kết nối Supabase Cloud

Tạo một project trên Supabase, sau đó đăng nhập CLI và link repository với project đó:

```bash
npx supabase@2.120.0 login
npx supabase@2.120.0 link --project-ref YOUR_PROJECT_REF
```

Kiểm tra migration trước khi áp dụng:

```bash
npx supabase@2.120.0 db push --linked --dry-run
```

Sau khi đã review:

```bash
npx supabase@2.120.0 db push --linked --include-seed
```

Lấy **Project URL** và **Publishable key** từ Supabase Dashboard rồi khai báo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Không đưa secret key hoặc service role key vào biến `NEXT_PUBLIC_*`.

## Deploy Vercel

1. Push repository lên GitHub.
2. Import repository trong Vercel.
3. Thêm hai environment variables trong phần Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy.
5. Trong Supabase Auth settings, thêm domain Vercel vào Site URL / Redirect URLs khi dùng auth redirect.

Vercel chỉ deploy code. Nội dung học và tiến độ nằm trong Supabase nên chỉnh dữ liệu không cần deploy lại frontend.

## Cấu trúc dữ liệu

Các bảng chính:

- `courses`: cấp/lộ trình học.
- `units`: chặng trong lộ trình.
- `lessons`: bài học, nội dung động lưu trong JSONB.
- `vocabulary`: từ/cụm từ.
- `lesson_vocabulary`: nối từ vựng với bài học.
- `profiles`: thiết lập cá nhân.
- `lesson_progress`: tiến độ theo từng user.
- `review_state`: lịch ôn hiện tại.
- `review_attempts`: lịch sử mỗi lần ôn.

RLS đã được bật cho toàn bộ bảng public. Người học chỉ đọc/ghi dữ liệu cá nhân của mình; quyền quản trị nội dung kiểm tra từ `app_metadata.role = admin`.

## Kiểm tra trước khi deploy

```bash
npm run lint
npm run build
npx supabase@2.120.0 db advisors --local
```

## Bước phát triển tiếp theo

Bản hiện tại là nền tảng MVP. Các phần nên làm tiếp theo theo thứ tự:

1. SRS nâng cao hơn thay cho khoảng lặp cố định.
2. Ngân hàng câu hỏi và luyện sai.
3. Audio + Supabase Storage.
4. Trang admin để nhập/xuất bản nội dung.
5. Đọc hiểu, nghe hiểu và thi thử.
6. Mở rộng dữ liệu từ N5 lên N4 → N1.
