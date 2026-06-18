import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email(
      "\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u306e\u5f62\u5f0f\u3067\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
    ),
  password: z
    .string()
    .min(
      1,
      "\u30d1\u30b9\u30ef\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
