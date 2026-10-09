import { AuthForm } from "@/components/auth-form";
export const instant = false;
export default function Page({ searchParams }: { searchParams: Promise<{ message?: string; email?: string }> }) { return <AuthForm mode="forgot" searchParams={searchParams} />; }
