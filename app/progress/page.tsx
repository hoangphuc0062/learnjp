import {
  CheckCircle,
  Clock,
  Fire,
  Target,
} from "@phosphor-icons/react/dist/ssr";

import { AppShell } from "@/components/app-shell";
import { getDashboardData } from "@/lib/learning/data";

export const metadata = { title: "Tiến độ" };
export const instant = false;

export default async function ProgressPage() {
  const data = await getDashboardData();
  const stats = [
    { label: "Chuỗi học", value: `${data.streakDays} ngày`, icon: Fire },
    { label: "Tuần này", value: `${data.weekMinutes} phút`, icon: Clock },
    {
      label: "Bài hoàn thành",
      value: `${data.completedLessons}/${data.totalLessons}`,
      icon: CheckCircle,
    },
    { label: "Tiến độ N5", value: `${data.courseProgress}%`, icon: Target },
  ];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Tiến độ
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-4xl">
            Nhìn thấy mình đang tiến lên
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Ưu tiên sự đều đặn và khả năng nhớ lại, thay vì chỉ đếm số bài đã
            mở.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[24px] border border-stone-200 bg-white p-5"
              >
                <Icon className="size-5 text-teal-700" weight="fill" />
                <p className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-stone-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 rounded-[28px] border border-stone-200 bg-white p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                7 ngày gần đây
              </p>
              <h2 className="mt-1 text-xl font-semibold text-stone-950">
                Nhịp học của bạn
              </h2>
            </div>
            <p className="text-sm font-bold text-stone-500">
              {data.weekMinutes} phút
            </p>
          </div>
          <div className="mt-8 grid h-44 grid-cols-7 items-end gap-2 sm:gap-4">
            {data.weekActivity.map((value, index) => (
              <div
                key={index}
                className="flex h-full flex-col justify-end gap-2 text-center"
              >
                <div
                  className="mx-auto w-full max-w-12 rounded-t-xl bg-[#17665c]"
                  style={{ height: `${Math.max(value, 8)}%` }}
                />
                <span className="text-[11px] font-semibold text-stone-400">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-[#153f3a] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5d99b]">
            Điểm cần giữ
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Đều đặn quan trọng hơn học dồn
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50/75">
            Với mục tiêu hiện tại, 20–30 phút mỗi ngày đủ để xây nền N5 vững nếu
            bạn ôn đúng lịch và xử lý lại các mục thường sai.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
