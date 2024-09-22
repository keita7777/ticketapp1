import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Name is required.").max(255),
  username: z.string().min(3, "Username is required.").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(255)
    // ユーザー更新時、パスワードは更新しない場合もある
    // 更新時は必ずしもパスワードを渡す必要ないのでoptionalとする
    .optional()
    // 空のパスワードを渡すことができる
    // ユーザー更新時、パスワードの入力を必須にしない
    .or(z.literal("")),
  role: z.string().min(3, "Role is required.").max(10),
});
