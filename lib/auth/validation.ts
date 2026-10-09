import { z } from "zod";

export type AuthMode = "login" | "register" | "forgot" | "resend" | "reset";

export type AuthInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthField = keyof AuthInputs;
export type AuthFieldErrors = Partial<Record<AuthField, string>>;

const email = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập email.")
  .max(254, "Email tối đa 254 ký tự.")
  .email("Email không đúng định dạng.");

const name = z
  .string()
  .trim()
  .min(2, "Tên hiển thị cần ít nhất 2 ký tự.")
  .max(60, "Tên hiển thị tối đa 60 ký tự.");

export const password = z
  .string()
  .min(8, "Mật khẩu cần ít nhất 8 ký tự.")
  .max(72, "Mật khẩu tối đa 72 ký tự.")
  .regex(/[a-z]/, "Mật khẩu cần có chữ thường (a-z).")
  .regex(/[A-Z]/, "Mật khẩu cần có chữ hoa (A-Z).")
  .regex(/[0-9]/, "Mật khẩu cần có chữ số (0-9).")
  .regex(/[^A-Za-z0-9\s]/, "Mật khẩu cần có ký tự đặc biệt.")
  .regex(/^\S+$/, "Mật khẩu không được chứa khoảng trắng.");

const loginSchema = z.object({
  email,
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

const confirmPassword = z.string().min(1, "Vui lòng xác nhận mật khẩu.");
const matchingPasswords = <T extends { password: string; confirmPassword: string }>(values: T) =>
  values.password === values.confirmPassword;

const registerSchema = z
  .object({ name, email, password, confirmPassword })
  .refine(matchingPasswords, {
    message: "Mật khẩu xác nhận chưa trùng khớp.",
    path: ["confirmPassword"],
  });

const emailOnlySchema = z.object({ email });
const resetSchema = z.object({ password, confirmPassword }).refine(matchingPasswords, {
  message: "Mật khẩu xác nhận chưa trùng khớp.",
  path: ["confirmPassword"],
});

export function validateAuthInputs(mode: AuthMode, inputs: AuthInputs) {
  const result =
    mode === "register"
      ? registerSchema.safeParse(inputs)
      : mode === "login"
        ? loginSchema.safeParse(inputs)
        : mode === "reset"
          ? resetSchema.safeParse(inputs)
          : emailOnlySchema.safeParse(inputs);

  if (result.success) return { valid: true as const, errors: {} as AuthFieldErrors };

  const errors: AuthFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as AuthField;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { valid: false as const, errors };
}

export function authInputsFromForm(formData: FormData): AuthInputs {
  const text = (field: AuthField) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    email: text("email").trim().toLowerCase(),
    password: text("password"),
    confirmPassword: text("confirmPassword"),
  };
}
