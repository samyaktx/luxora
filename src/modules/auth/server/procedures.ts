import { headers as getHeaders } from "next/headers";
import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";


export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const existingData = await ctx.db.find({
          collection: "users",
          limit: 1,
          where: {
            username: {
              equals: input.username,
            },
          },
        });

        const existingUser = existingData.docs[0];
        if (existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already taken",
          });
        }

        await ctx.db.create({
          collection: "users",
          data: {
            email: input.email,
            username: input.username,
            password: input.password, // hash password
          },
        });

        const data = await ctx.db.login({
          collection: "users",
          data: {
            email: input.email,
            password: input.password, 
          },
        });

        if (!data.token) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Failed to login",
          });
        }

        await generateAuthCookie({
          prefix: ctx.db.config.cookiePrefix,
          value: data.token,
        });

        return { success: true, message: "User registered successfully" };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Registration failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
        });
      }
    }),
    login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,  // hash password
        }
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login"
        });
      }

      await generateAuthCookie({ 
        prefix: ctx.db.config.cookiePrefix, 
        value: data.token
      })

      return data;
    }),
}); 
