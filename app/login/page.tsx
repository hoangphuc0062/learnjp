import { AuthForm } from "@/components/auth-form";
export const instant = false;
export const metadata = { title: "Đăng nhập" };
export default function Page({ searchParams }: PageProps<"/login">) { return <AuthForm mode="login" searchParams={searchParams} />; }
