import z from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(64, "Username must be less then 64 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers and hyhens. It must start and end with a letter or number"
    )
    .refine(
      (val) => !val.includes("--"),
      "User cannout contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});