export function N5Illustration({
  tile,
  label,
}: {
  tile: number;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Minh hoạ: ${label}`}
      className="aspect-square w-full rounded-2xl bg-[#fff9e9]"
      style={{
        backgroundImage: `url("${publicCourseAsset('/n5/vocabulary-atlas.png')}")`,
        backgroundSize: "600% 600%",
        backgroundPosition: `${(tile % 6) * 20}% ${Math.floor(tile / 6) * 20}%`,
      }}
    />
  );
}
import { publicCourseAsset } from "@/lib/supabase/storage";
